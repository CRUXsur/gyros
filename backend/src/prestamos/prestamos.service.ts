import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { Repository } from 'typeorm';
import { Prestamo} from './entities/prestamo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable,InternalServerErrorException, Logger } from '@nestjs/common';


@Injectable()
export class PrestamosService {

  private readonly logger = new Logger('');

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
      this.handleDBExceptions(error);
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



private handleDBExceptions(error: any){
  if(error.code === '23505') 
    throw new BadRequestException(error.detail);

  this.logger.error(error);
  // console.log(error);
  throw new InternalServerErrorException('Ayuda!');
}

}