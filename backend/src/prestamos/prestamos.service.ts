import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { Repository } from 'typeorm';
import { Prestamo} from './entities/prestamo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable,InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class PrestamosService {

  private readonly logger = new Logger('');

  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
  ){}

  async create(createPrestamoDto: CreatePrestamoDto) {
    try {
      // if(!createPrestamoDto.slug) {
      //   createPrestamoDto.slug = createPrestamoDto.title
      //      .toLowerCase()
      //      .replaceAll(' ', '_')
      //      .replaceAll("'", '');
      // }else{
      //   createPrestamoDto.slug = createPrestamoDto.slug
      //      .toLowerCase()
      //      .replaceAll(' ', '_')
      //      .replaceAll("'", '');
      // }

      const prestamo = this.prestamoRepository.create(createPrestamoDto);
      await this.prestamoRepository.save(prestamo);

      return prestamo;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }


  findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    return this.prestamoRepository.find({
      take: limit,
      skip: offset,
      //TODO: Relaciones
    });
  }

  async findOne(id: string) {
    const prestamo = await this.prestamoRepository.findOneBy({id});
    if(!prestamo) 
      throw new NotFoundException(`Prestamo con id ${id} no encontrado`);
    return prestamo;
  }

  update(id: number, updatePrestamoDto: UpdatePrestamoDto) {
    return `This action updates a #${id} prestamo`;
  }

  async remove(id: string) {
    const prestamo = await this.findOne(id);
    await this.prestamoRepository.remove(prestamo);
  }



private handleDBExceptions(error: any){
  if(error.code === '23505') 
    throw new BadRequestException(error.detail);

  this.logger.error(error);
  // console.log(error);
  throw new InternalServerErrorException('Ayuda!');
}

}