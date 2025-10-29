import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from './entities/reporte.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ReportesService {

  private readonly logger = new Logger('ReportesService');

  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
  ) {}

  async create(createReporteDto: CreateReporteDto, user: User) {
    try {
      const reporte = this.reporteRepository.create({
        ...createReporteDto,
        user,
      });

      await this.reporteRepository.save(reporte);
      return reporte;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return await this.reporteRepository.find({
      take: limit,
      skip: offset,
      relations: {
        user: true,
      },
      order: {
        fecha_hora_actualizacion: 'DESC',
      }
    });
  }

  async findOne(id_reporte: string) {
    if (!isUUID(id_reporte)) {
      throw new BadRequestException('El ID debe ser un UUID válido');
    }

    const reporte = await this.reporteRepository.findOne({
      where: { id_reporte },
      relations: {
        user: true,
      }
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte con id ${id_reporte} no encontrado`);
    }

    return reporte;
  }

  async findByUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('El ID del usuario debe ser un UUID válido');
    }

    return await this.reporteRepository.find({
      where: {
        user: { id: userId }
      },
      relations: {
        user: true,
      },
      order: {
        fecha_hora_actualizacion: 'DESC'
      }
    });
  }

  async update(id_reporte: string, updateReporteDto: UpdateReporteDto, user: User) {
    try {
      // Verificar que el reporte existe
      const reporte = await this.findOne(id_reporte);
      
      const reporteToUpdate = await this.reporteRepository.preload({
        id_reporte: reporte.id_reporte,
        ...updateReporteDto,
        user, // Actualizar el usuario que modifica
      });

      if (!reporteToUpdate) {
        throw new NotFoundException(`Reporte con id ${id_reporte} no encontrado`);
      }

      await this.reporteRepository.save(reporteToUpdate);
      return this.findOne(id_reporte);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_reporte: string) {
    const reporte = await this.findOne(id_reporte);
    await this.reporteRepository.remove(reporte);
    return { message: `Reporte ${id_reporte} eliminado correctamente` };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}

