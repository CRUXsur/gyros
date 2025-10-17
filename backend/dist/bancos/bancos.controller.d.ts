import { BancosService } from './bancos.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
export declare class BancosController {
    private readonly bancosService;
    constructor(bancosService: BancosService);
    create(createBancoDto: CreateBancoDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, updateBancoDto: UpdateBancoDto): Promise<any>;
    remove(id: string): Promise<void>;
}
