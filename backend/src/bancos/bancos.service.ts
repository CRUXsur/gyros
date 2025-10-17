import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Banco } from './entities/banco.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BancosService {

  private readonly logger = new Logger('BancosService');

  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
  ){}

  async create(createBancoDto: CreateBancoDto) {
    try {
      const banco = this.bancoRepository.create(createBancoDto);
      await this.bancoRepository.save(banco);
      return banco;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.bancoRepository.find({
      where: { isActive: true }
    });
  }

  async findOne(id: string) {
    const banco = await this.bancoRepository.findOneBy({id_banco: id});
    
    if(!banco) {
      throw new NotFoundException(`Banco con id ${id} no encontrado`);
    }
    return banco;
  }

  async update(id_banco: string, updateBancoDto: UpdateBancoDto) {
    try {
      const banco = await this.findOne(id_banco);
      
      const bancoToUpdate = await this.bancoRepository.preload({
        id_banco: banco.id_banco,
        ...updateBancoDto,
      });

      if (!bancoToUpdate) {
        throw new NotFoundException(`Banco con id ${id_banco} no encontrado`);
      }

      await this.bancoRepository.save(bancoToUpdate);
      return bancoToUpdate;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_banco: string) {
    const banco = await this.findOne(id_banco);
    await this.bancoRepository.remove(banco);
  }

  private handleDBExceptions(error: any){
    if(error.code === '23505') 
      throw new BadRequestException(error.detail);
  
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

