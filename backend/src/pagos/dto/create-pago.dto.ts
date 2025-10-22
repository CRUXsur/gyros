import { IsString, MinLength, IsNumber, IsPositive, 
         IsOptional, IsIn, IsDate, IsBoolean     
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePagoDto {
 
    @IsString()
    @MinLength(1)
    @IsOptional()
    id_cuota?: string;

    @IsString()
    @MinLength(1)
    id_prestamo: string;

    @IsNumber()
    @IsPositive()
    monto_pago: number;

    @IsDate()
    @Type(() => Date)
    fecha_pago: Date;

    @IsNumber()
    @IsOptional()
    inicial?: number;

    @IsNumber()
    @IsOptional()
    final?: number;

    @IsNumber()
    @IsOptional()
    debitado?: number;

    @IsNumber()
    @IsOptional()
    interes?: number;

    @IsNumber()
    @IsOptional()
    dev_kapital?: number;

    @IsNumber()
    @IsOptional()
    saldo_deudor?: number;

    @IsString()
    @IsIn(['pendiente', 'pagado', 'parcial', 'vencido'])
    @IsOptional()
    estado?: string;

    @IsString()
    @IsIn(['efectivo', 'transferencia', 'cheque', 'tarjeta'])
    @IsOptional()
    metodo_pago?: string;

    @IsString()
    @IsOptional()
    numero_comprobante?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
