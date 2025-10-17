import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<any>;
    findByDeviceId(device_id: string): Promise<any>;
    findOne(term: string): Promise<import("./entities/cliente.entity").Cliente>;
    findAll(): Promise<any>;
    update(id: string, updateClienteDto: UpdateClienteDto): Promise<any>;
    remove(id: string): Promise<void>;
}
