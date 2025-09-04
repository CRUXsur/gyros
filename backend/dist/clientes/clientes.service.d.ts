import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
export declare class ClientesService {
    private readonly clienteRepository;
    private readonly logger;
    constructor(clienteRepository: Repository<Cliente>);
    create(createClienteDto: CreateClienteDto): Promise<Cliente | undefined>;
    findAll(): Promise<Cliente[]>;
    findOne(term: string): Promise<Cliente>;
    update(id: number, updateClienteDto: UpdateClienteDto): string;
    remove(id: string): Promise<void>;
    private handleDBExceptions;
}
