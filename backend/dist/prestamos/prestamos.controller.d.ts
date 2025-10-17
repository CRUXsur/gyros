import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
export declare class PrestamosController {
    private readonly prestamosService;
    constructor(prestamosService: PrestamosService);
    create(createPrestamoDto: CreatePrestamoDto, user: User): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<any>;
    findOne(id_prestamo: string): Promise<{
        images: string[];
        id_prestamo: string;
        cliente: import("../clientes/entities/cliente.entity").Cliente;
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
        cliente: import("../clientes/entities/cliente.entity").Cliente;
        monto_prestado: number;
        tasa_interes: number;
        plazo_meses: number;
        fecha_prestamo: Date;
        fecha_vencimiento: Date;
        isActive: boolean;
        user: User;
    } | undefined>;
    remove(id_prestamo: string): Promise<void>;
}
