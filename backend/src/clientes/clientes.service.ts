import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';


@Injectable()
export class ClientesService {

  private readonly logger = new Logger('');

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ){}


  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto);
      await this.clienteRepository.save(cliente);
      return cliente;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: Agregar paginacion
  findAll() {
    return this.clienteRepository.find({});
  }

  async findOne(term: string) {

    let cliente: Cliente | null;

    if(isUUID(term)) {
      cliente = await this.clienteRepository.findOneBy({id:term});
    }else{
      cliente = await this.clienteRepository.findOneBy({ci:term});
    }

    // const cliente = await this.clienteRepository.findOneBy({id});
    if(!cliente) {
      throw new NotFoundException(`Cliente con id ${term} no encontrado`);
    }
    return cliente;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }







  private handleDBExceptions(error: any){
    if(error.code === '23505') 
      throw new BadRequestException(error.detail);
  
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
