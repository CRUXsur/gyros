import { CuotasService } from './cuotas.service';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { UpdateCuotaDto } from './dto/update-cuota.dto';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
export declare class CuotasController {
    private readonly cuotasService;
    constructor(cuotasService: CuotasService);
    create(createCuotaDto: CreateCuotaDto, user: User): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<any>;
    findOne(id_cuota: string): Promise<any>;
    findByPrestamo(id_prestamo: string): Promise<any>;
    update(id_cuota: string, updateCuotaDto: UpdateCuotaDto, user: User): Promise<any>;
    remove(id_cuota: string): Promise<{
        message: string;
    }>;
}
