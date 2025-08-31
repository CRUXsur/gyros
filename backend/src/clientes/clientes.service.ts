import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


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

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }







  private handleDBExceptions(error: any){
    if(error.code === '23505') 
      throw new BadRequestException(error.detail);
  
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
