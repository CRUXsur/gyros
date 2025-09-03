import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { DataSource, Repository } from 'typeorm';
import { Prestamo, PrestamoImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';
export declare class PrestamosService {
    private readonly prestamoRepository;
    private readonly prestamoImageRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(prestamoRepository: Repository<Prestamo>, prestamoImageRepository: Repository<PrestamoImage>, dataSource: DataSource);
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
    findOne(term: string): Promise<Prestamo>;
    findOnePlain(term: string): Promise<{
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
    private handleDBExceptions;
    deleteAllPrestamos(): Promise<import("typeorm").DeleteResult | undefined>;
}
