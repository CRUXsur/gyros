import { BancoClienteService } from './banco-cliente.service';
import { CreateBancoClienteDto } from './dto/create-banco-cliente.dto';
import { UpdateBancoClienteDto } from './dto/update-banco-cliente.dto';
export declare class BancoClienteController {
    private readonly bancoClienteService;
    constructor(bancoClienteService: BancoClienteService);
    create(createBancoClienteDto: CreateBancoClienteDto): Promise<any>;
    findAll(): Promise<any>;
    findByCliente(clienteId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateBancoClienteDto: UpdateBancoClienteDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
