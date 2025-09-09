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
      cliente = await this.clienteRepository.findOneBy({id_cliente:term});
    }else{
      cliente = await this.clienteRepository.findOneBy({ci:term});
    }

    // const cliente = await this.clienteRepository.findOneBy({id});
    if(!cliente) {
      throw new NotFoundException(`Cliente con id ${term} no encontrado`);
    }
    return cliente;
  }

  async update(id_cliente: string, updateClienteDto: UpdateClienteDto) {
    try {
      // Verificar que el cliente existe
      const cliente = await this.findOne(id_cliente);
      
      // Precargar los datos actualizados
      const clienteToUpdate = await this.clienteRepository.preload({
        id_cliente: cliente.id_cliente,
        ...updateClienteDto,
      });

      if (!clienteToUpdate) {
        throw new NotFoundException(`Cliente con id ${id_cliente} no encontrado`);
      }

      await this.clienteRepository.save(clienteToUpdate);
      return clienteToUpdate;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_cliente: string) {
    const cliente = await this.findOne(id_cliente);
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
