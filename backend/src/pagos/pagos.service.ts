import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class PagosService {

  private readonly logger = new Logger('PagosService');

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Cuota)
    private readonly cuotaRepository: Repository<Cuota>,
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPagoDto: CreatePagoDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id_cuota, id_prestamo, monto_pago, ...pagoDetails } = createPagoDto;
      
      // Verificar que la cuota existe
      const cuota = await this.cuotaRepository.findOneBy({ id_cuota });
      if (!cuota) {
        throw new NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
      }

      // Verificar que el préstamo existe
      const prestamo = await this.prestamoRepository.findOneBy({ id_prestamo });
      if (!prestamo) {
        throw new NotFoundException(`Préstamo con id ${id_prestamo} no encontrado`);
      }

      // Verificar que la cuota pertenece al préstamo
      if (cuota.prestamo.id_prestamo !== id_prestamo) {
        throw new BadRequestException('La cuota no pertenece al préstamo especificado');
      }

      // Validar que el monto del pago no exceda el monto pendiente de la cuota
      const montoPendiente = cuota.monto_cuota - cuota.monto_pagado;
      if (monto_pago > montoPendiente) {
        throw new BadRequestException(`El monto del pago ($${monto_pago}) no puede ser mayor al monto pendiente ($${montoPendiente})`);
      }

      // Crear el pago
      const pago = this.pagoRepository.create({
        ...pagoDetails,
        monto_pago,
        cuota,
        prestamo,
        user,
      });

      await queryRunner.manager.save(pago);

      // Actualizar la cuota con el nuevo monto pagado
      const nuevoMontoPagado = cuota.monto_pagado + monto_pago;
      const nuevoEstado = nuevoMontoPagado >= cuota.monto_cuota ? 'pagado' : 'pendiente';

      const updateData: any = {
        monto_pagado: nuevoMontoPagado,
        estado: nuevoEstado
      };

      if (nuevoEstado === 'pagado') {
        updateData.fecha_pago = createPagoDto.fecha_pago;
      }

      await queryRunner.manager.update(Cuota, 
        { id_cuota }, 
        updateData
      );

      await queryRunner.commitTransaction();
      
      // Retornar el pago con las relaciones actualizadas
      return await this.findOne(pago.id_pago);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return await this.pagoRepository.find({
      take: limit,
      skip: offset,
      relations: {
        cuota: true,
        prestamo: true,
        user: true,
      },
      order: {
        fecha_pago: 'DESC'
      }
    });
  }

  async findOne(id_pago: string) {
    if (!isUUID(id_pago)) {
      throw new BadRequestException('El ID debe ser un UUID válido');
    }

    const pago = await this.pagoRepository.findOne({
      where: { id_pago },
      relations: {
        cuota: true,
        prestamo: true,
        user: true,
      }
    });

    if (!pago) {
      throw new NotFoundException(`Pago con id ${id_pago} no encontrado`);
    }

    return pago;
  }

  async findByPrestamo(id_prestamo: string) {
    if (!isUUID(id_prestamo)) {
      throw new BadRequestException('El ID del préstamo debe ser un UUID válido');
    }

    return await this.pagoRepository.find({
      where: {
        prestamo: { id_prestamo }
      },
      relations: {
        cuota: true,
        prestamo: true,
        user: true,
      },
      order: {
        fecha_pago: 'DESC'
      }
    });
  }

  async findByCuota(id_cuota: string) {
    if (!isUUID(id_cuota)) {
      throw new BadRequestException('El ID de la cuota debe ser un UUID válido');
    }

    return await this.pagoRepository.find({
      where: {
        cuota: { id_cuota }
      },
      relations: {
        cuota: true,
        prestamo: true,
        user: true,
      },
      order: {
        fecha_pago: 'DESC'
      }
    });
  }

  async update(id_pago: string, updatePagoDto: UpdatePagoDto, user: User) {
    try {
      // Verificar que el pago existe
      const pago = await this.findOne(id_pago);
      
      const pagoToUpdate = await this.pagoRepository.preload({
        id_pago: pago.id_pago,
        ...updatePagoDto,
        user, // Actualizar el usuario que modifica
      });

      if (!pagoToUpdate) {
        throw new NotFoundException(`Pago con id ${id_pago} no encontrado`);
      }

      await this.pagoRepository.save(pagoToUpdate);
      return this.findOne(id_pago);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_pago: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pago = await this.findOne(id_pago);
      
      // Actualizar la cuota restando el monto del pago eliminado
      const cuota = pago.cuota;
      const nuevoMontoPagado = cuota.monto_pagado - pago.monto_pago;
      const nuevoEstado = nuevoMontoPagado >= cuota.monto_cuota ? 'pagado' : 'pendiente';

      const updateData: any = {
        monto_pagado: nuevoMontoPagado,
        estado: nuevoEstado
      };

      if (nuevoEstado === 'pagado') {
        updateData.fecha_pago = cuota.fecha_pago;
      } else {
        updateData.fecha_pago = null;
      }

      await queryRunner.manager.update(Cuota, 
        { id_cuota: cuota.id_cuota }, 
        updateData
      );

      await queryRunner.manager.remove(pago);
      await queryRunner.commitTransaction();
      
      return { message: `Pago ${id_pago} eliminado correctamente` };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error instanceof BadRequestException || 
        error instanceof NotFoundException) {
      throw error;
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}