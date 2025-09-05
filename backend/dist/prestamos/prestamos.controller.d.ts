import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
export declare class PrestamosController {
    private readonly prestamosService;
    constructor(prestamosService: PrestamosService);
    create(createPrestamoDto: CreatePrestamoDto, user: User): Promise<{
        images: string[];
        id: string;
        monto: number;
        nocuotas: number;
        capital: number;
        interes: number;
        saldo: number;
        user: User;
    } | undefined>;
    findAll(paginationDto: PaginationDto): Promise<{
        images: string[] | undefined;
        id: string;
        monto: number;
        nocuotas: number;
        capital: number;
        interes: number;
        saldo: number;
        user: User;
    }[]>;
    findOne(term: string): Promise<{
        images: string[];
        id: string;
        monto: number;
        nocuotas: number;
        capital: number;
        interes: number;
        saldo: number;
        user: User;
    }>;
    update(id: string, updatePrestamoDto: UpdatePrestamoDto, user: User): Promise<{
        images: string[];
        id: string;
        monto: number;
        nocuotas: number;
        capital: number;
        interes: number;
        saldo: number;
        user: User;
    } | undefined>;
    remove(id: string): Promise<void>;
}
