import { Injectable } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { Repository } from 'typeorm';
import { Prestamo} from './entities/prestamo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PrestamosService {


  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
  ){}

  async create(createPrestamoDto: CreatePrestamoDto) {
    try {
      const prestamo = this.prestamoRepository.create(createPrestamoDto);
      await this.prestamoRepository.save(prestamo);
      
      return prestamo;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!');
    }

  }

  findAll() {
    return `This action returns all prestamos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prestamo`;
  }

  update(id: number, updatePrestamoDto: UpdatePrestamoDto) {
    return `This action updates a #${id} prestamo`;
  }

  remove(id: number) {
    return `This action removes a #${id} prestamo`;
  }
}
