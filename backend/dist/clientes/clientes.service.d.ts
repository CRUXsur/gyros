import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
export declare class ClientesService {
    private readonly clienteRepository;
    private readonly prestamoRepository;
    private readonly cuotaRepository;
    private readonly logger;
    constructor(clienteRepository: Repository<Cliente>, prestamoRepository: Repository<Prestamo>, cuotaRepository: Repository<Cuota>);
    create(createClienteDto: CreateClienteDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(term: string): Promise<Cliente>;
    findByDeviceId(device_id: string): Promise<any>;
    update(id_cliente: string, updateClienteDto: UpdateClienteDto): Promise<any>;
    remove(id_cliente: string): Promise<void>;
    private handleDBExceptions;
}
