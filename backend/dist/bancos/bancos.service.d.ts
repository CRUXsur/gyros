import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Banco } from './entities/banco.entity';
import { Repository } from 'typeorm';
export declare class BancosService {
    private readonly bancoRepository;
    private readonly logger;
    constructor(bancoRepository: Repository<Banco>);
    create(createBancoDto: CreateBancoDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id_banco: string, updateBancoDto: UpdateBancoDto): Promise<any>;
    remove(id_banco: string): Promise<void>;
    private handleDBExceptions;
}
