import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBancoClienteDto } from './dto/create-banco-cliente.dto';
import { UpdateBancoClienteDto } from './dto/update-banco-cliente.dto';
import { BancoCliente } from './entities/banco-cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class BancoClienteService {

  private readonly logger = new Logger('BancoClienteService');

  constructor(
    @InjectRepository(BancoCliente)
    private readonly bancoClienteRepository: Repository<BancoCliente>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ){}

  async create(createBancoClienteDto: CreateBancoClienteDto) {
    try {
      const { clienteId, ...bancoData } = createBancoClienteDto;

      // Verificar que el cliente existe
      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente: clienteId },
        relations: ['bancos'],
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${clienteId} no encontrado`);
      }

      // Verificar que el cliente no tenga más de 2 bancos activos
      const bancosActivos = cliente.bancos?.filter(b => b.isActive) || [];
      if (bancosActivos.length >= 2) {
        throw new BadRequestException('El cliente ya tiene 2 bancos activos registrados');
      }

      const bancoCliente = this.bancoClienteRepository.create({
        ...bancoData,
        cliente,
      });

      await this.bancoClienteRepository.save(bancoCliente);
      return bancoCliente;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return this.bancoClienteRepository.find({
      relations: ['cliente'],
      where: { isActive: true }
    });
  }

  async findByCliente(clienteId: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${clienteId} no encontrado`);
    }

    return this.bancoClienteRepository.find({
      where: { cliente: { id_cliente: clienteId } },
      relations: ['cliente'],
      order: { created_at: 'ASC' }
    });
  }

  async findOne(id: string) {
    const bancoCliente = await this.bancoClienteRepository.findOne({
      where: { id_banco_cliente: id },
      relations: ['cliente'],
    });
    
    if(!bancoCliente) {
      throw new NotFoundException(`Banco Cliente con id ${id} no encontrado`);
    }
    return bancoCliente;
  }

  async update(id_banco_cliente: string, updateBancoClienteDto: UpdateBancoClienteDto) {
    try {
      const bancoCliente = await this.findOne(id_banco_cliente);
      
      const { clienteId, ...bancoData } = updateBancoClienteDto;

      let cliente;
      if (clienteId && clienteId !== bancoCliente.cliente.id_cliente) {
        cliente = await this.clienteRepository.findOneBy({ id_cliente: clienteId });
        if (!cliente) {
          throw new NotFoundException(`Cliente con id ${clienteId} no encontrado`);
        }
      }

      const bancoClienteToUpdate = await this.bancoClienteRepository.preload({
        id_banco_cliente: bancoCliente.id_banco_cliente,
        ...bancoData,
        ...(cliente && { cliente }),
      });

      if (!bancoClienteToUpdate) {
        throw new NotFoundException(`Banco Cliente con id ${id_banco_cliente} no encontrado`);
      }

      await this.bancoClienteRepository.save(bancoClienteToUpdate);
      return this.findOne(id_banco_cliente);
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id_banco_cliente: string) {
    const bancoCliente = await this.findOne(id_banco_cliente);
    await this.bancoClienteRepository.remove(bancoCliente);
    return { message: 'Banco Cliente eliminado correctamente' };
  }

  private handleDBExceptions(error: any){
    if(error.code === '23505') 
      throw new BadRequestException(error.detail);
  
    if (error.status === 404)
      throw error;
  
    if (error instanceof BadRequestException)
      throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
