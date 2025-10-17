import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    create(createPagoDto: CreatePagoDto, user: User): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<any>;
    findOne(id_pago: string): Promise<any>;
    findByPrestamo(id_prestamo: string): Promise<any>;
    findByCuota(id_cuota: string): Promise<any>;
    update(id_pago: string, updatePagoDto: UpdatePagoDto, user: User): Promise<any>;
    remove(id_pago: string): Promise<{
        message: string;
    } | undefined>;
}
