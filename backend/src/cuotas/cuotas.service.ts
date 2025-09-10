import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { UpdateCuotaDto } from './dto/update-cuota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuota } from './entities/cuota.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CuotasService {

  private readonly logger = new Logger('CuotasService');

  constructor(
    @InjectRepository(Cuota)
    private readonly cuotaRepository: Repository<Cuota>,
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
  ) {}

  async create(createCuotaDto: CreateCuotaDto, user: User) {
    try {
      const { id_prestamo, ...cuotaDetails } = createCuotaDto;
      
      // Verificar que el préstamo existe
      const prestamo = await this.prestamoRepository.findOneBy({ id_prestamo });
      if (!prestamo) {
        throw new NotFoundException(`Préstamo con id ${id_prestamo} no encontrado`);
      }

      // Verificar que no exista ya una cuota con el mismo número para este préstamo
      const existingCuota = await this.cuotaRepository.findOne({
        where: {
          prestamo: { id_prestamo },
          numero_cuota: createCuotaDto.numero_cuota
        }
      });

      if (existingCuota) {
        throw new BadRequestException(`Ya existe una cuota número ${createCuotaDto.numero_cuota} para este préstamo`);
      }

      const cuota = this.cuotaRepository.create({
        ...cuotaDetails,
        prestamo,
        user,
      });

      await this.cuotaRepository.save(cuota);
      return cuota;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return await this.cuotaRepository.find({
      take: limit,
      skip: offset,
      relations: {
        prestamo: true,
        user: true,
      },
      order: {
        fecha_vencimiento: 'ASC',
        numero_cuota: 'ASC'
      }
    });
  }

  async findOne(id_cuota: string) {
    if (!isUUID(id_cuota)) {
      throw new BadRequestException('El ID debe ser un UUID válido');
    }

    const cuota = await this.cuotaRepository.findOne({
      where: { id_cuota },
      relations: {
        prestamo: true,
        user: true,
      }
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
    }

    return cuota;
  }

  async findByPrestamo(id_prestamo: string) {
    if (!isUUID(id_prestamo)) {
      throw new BadRequestException('El ID del préstamo debe ser un UUID válido');
    }

    return await this.cuotaRepository.find({
      where: {
        prestamo: { id_prestamo }
      },
      relations: {
        prestamo: true,
        user: true,
      },
      order: {
        numero_cuota: 'ASC'
      }
    });
  }

  async update(id_cuota: string, updateCuotaDto: UpdateCuotaDto, user: User) {
    try {
      // Verificar que la cuota existe
      const cuota = await this.findOne(id_cuota);
      
      const cuotaToUpdate = await this.cuotaRepository.preload({
        id_cuota: cuota.id_cuota,
        ...updateCuotaDto,
        user, // Actualizar el usuario que modifica
      });

      if (!cuotaToUpdate) {
        throw new NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
      }

      await this.cuotaRepository.save(cuotaToUpdate);
      return this.findOne(id_cuota);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_cuota: string) {
    const cuota = await this.findOne(id_cuota);
    await this.cuotaRepository.remove(cuota);
    return { message: `Cuota ${id_cuota} eliminada correctamente` };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}