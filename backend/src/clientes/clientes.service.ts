import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';


@Injectable()
export class ClientesService {

  private readonly logger = new Logger('');

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(Cuota)
    private readonly cuotaRepository: Repository<Cuota>,
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
  async findAll() {
    const clientes = await this.clienteRepository.find({});
    
    // Para cada cliente, obtener información de préstamos y cuotas
    const clientesConDatos = await Promise.all(
      clientes.map(async (cliente) => {
        // Buscar préstamos activos del cliente
        const prestamos = await this.prestamoRepository.find({
          where: { 
            cliente: { id_cliente: cliente.id_cliente },
            isActive: true 
          },
          order: { fecha_prestamo: 'DESC' }
        });

        // Si tiene préstamos, obtener el más reciente
        let monto_prestado: number | null = null;
        let monto_cuota: number | null = null;

        if (prestamos.length > 0) {
          const prestamoActual = prestamos[0];
          monto_prestado = prestamoActual.monto_prestado;

          // Buscar cuotas del préstamo actual
          const cuotas = await this.cuotaRepository.find({
            where: { 
              prestamo: { id_prestamo: prestamoActual.id_prestamo },
              isActive: true 
            },
            order: { numero_cuota: 'ASC' }
          });

          // Tomar el monto de la primera cuota
          if (cuotas.length > 0) {
            monto_cuota = cuotas[0].monto_cuota;
          }
        }

        return {
          ...cliente,
          monto_prestado,
          monto_cuota,
          prestamos
        };
      })
    );

    return clientesConDatos;
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

  async findByDeviceId(device_id: string) {
    const cliente = await this.clienteRepository.findOneBy({device_id});
    
    if(!cliente) {
      throw new NotFoundException(`Cliente con device_id ${device_id} no encontrado`);
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
