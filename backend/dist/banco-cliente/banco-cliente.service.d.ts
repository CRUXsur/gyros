import { CreateBancoClienteDto } from './dto/create-banco-cliente.dto';
import { UpdateBancoClienteDto } from './dto/update-banco-cliente.dto';
import { BancoCliente } from './entities/banco-cliente.entity';
import { Repository } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
export declare class BancoClienteService {
    private readonly bancoClienteRepository;
    private readonly clienteRepository;
    private readonly logger;
    constructor(bancoClienteRepository: Repository<BancoCliente>, clienteRepository: Repository<Cliente>);
    create(createBancoClienteDto: CreateBancoClienteDto): Promise<any>;
    findAll(): Promise<any>;
    findByCliente(clienteId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id_banco_cliente: string, updateBancoClienteDto: UpdateBancoClienteDto): Promise<any>;
    remove(id_banco_cliente: string): Promise<{
        message: string;
    }>;
    private handleDBExceptions;
}
