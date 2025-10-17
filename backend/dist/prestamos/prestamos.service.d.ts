import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { DataSource, Repository } from 'typeorm';
import { Prestamo, PrestamoImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
export declare class PrestamosService {
    private readonly prestamoRepository;
    private readonly prestamoImageRepository;
    private readonly clienteRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(prestamoRepository: Repository<Prestamo>, prestamoImageRepository: Repository<PrestamoImage>, clienteRepository: Repository<Cliente>, dataSource: DataSource);
    create(createPrestamoDto: CreatePrestamoDto, user: User): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<any>;
    findOne(term: string): Promise<Prestamo>;
    findOnePlain(term: string): Promise<{
        images: string[];
        id_prestamo: string;
        cliente: Cliente;
        monto_prestado: number;
        tasa_interes: number;
        plazo_meses: number;
        fecha_prestamo: Date;
        fecha_vencimiento: Date;
        isActive: boolean;
        user: User;
    }>;
    update(id_prestamo: string, updatePrestamoDto: UpdatePrestamoDto, user: User): Promise<{
        images: string[];
        id_prestamo: string;
        cliente: Cliente;
        monto_prestado: number;
        tasa_interes: number;
        plazo_meses: number;
        fecha_prestamo: Date;
        fecha_vencimiento: Date;
        isActive: boolean;
        user: User;
    } | undefined>;
    remove(id_prestamo: string): Promise<void>;
    private handleDBExceptions;
    deleteAllPrestamos(): Promise<any>;
}
