import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { DataSource, Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
export declare class PagosService {
    private readonly pagoRepository;
    private readonly cuotaRepository;
    private readonly prestamoRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(pagoRepository: Repository<Pago>, cuotaRepository: Repository<Cuota>, prestamoRepository: Repository<Prestamo>, dataSource: DataSource);
    create(createPagoDto: CreatePagoDto, user: User): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<any>;
    findOne(id_pago: string): Promise<any>;
    findByPrestamo(id_prestamo: string): Promise<any>;
    findByCuota(id_cuota: string): Promise<any>;
    update(id_pago: string, updatePagoDto: UpdatePagoDto, user: User): Promise<any>;
    remove(id_pago: string): Promise<{
        message: string;
    } | undefined>;
    private handleDBExceptions;
}
