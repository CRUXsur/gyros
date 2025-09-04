import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { DataSource, Repository } from 'typeorm';
import { Prestamo,PrestamoImage} from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable,InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID} from 'uuid';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PrestamosService {

  private readonly logger = new Logger('');

  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(PrestamoImage)
    private readonly prestamoImageRepository: Repository<PrestamoImage>,
    private readonly dataSource: DataSource,
  ){}

  async create(createPrestamoDto: CreatePrestamoDto, user: User) {
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

      const {images = [], ...prestamoDetails} = createPrestamoDto;
      const prestamo = this.prestamoRepository.create({
        ...prestamoDetails,
        images: images.map(image => this.prestamoImageRepository.create({url: image})),
        // user: user,
        user,
      });
      await this.prestamoRepository.save(prestamo);

      // return prestamo;
      return {...prestamo, images: images};
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }


  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    const prestamos = await this.prestamoRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })
    return prestamos.map(prestamo => ({
      ...prestamo,
      images: prestamo.images?.map(img => img.url),
    }));
  }

  async findOne(term: string) {
    
    let prestamo: Prestamo | null;
    
    if(isUUID(term)) {
      prestamo = await this.prestamoRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.prestamoRepository.createQueryBuilder();
      prestamo = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prestamo.images', 'images')
        .getOne();
    }

    if(!prestamo) 
      throw new NotFoundException(`Prestamo con id ${term} no encontrado`);
    return prestamo;
    
  }


  async findOnePlain(term: string) {
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url),
    }
  }

  
  async update(id: string, updatePrestamoDto: UpdatePrestamoDto, user: User) {
    const {images, ...toUpdate} = updatePrestamoDto;
    const prestamo = await this.prestamoRepository.preload({
      id,...toUpdate,
    });

    // const prestamo = await this.prestamoRepository.preload({
    //   id: id,
    //   ...updatePrestamoDto,
    //   images: [],
    // });

    if(!prestamo) throw new NotFoundException(`Prestamo con id ${id} no encontrado`);
 
    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      if(images) {
        await queryRunner.manager.delete(PrestamoImage, {prestamo: {id}});
        prestamo.images = images.map(
          image => this.prestamoImageRepository.create({url: image})
        );
      }else{
        // prestamo.images
        prestamo.images = await this.prestamoImageRepository.findBy({prestamo: {id}});
      }
      prestamo.user = user;
      await queryRunner.manager.save(prestamo);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // return prestamo;
      return this.findOnePlain( id );

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
   
    
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


async deleteAllPrestamos(){
  const query = this.prestamoRepository.createQueryBuilder('prestamo');
  try {
    return await query
    .delete()
    .execute();
  } catch (error) {
    this.handleDBExceptions(error);
  }
}



}