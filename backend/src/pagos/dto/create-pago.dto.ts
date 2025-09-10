import { IsString, MinLength, IsNumber, IsPositive, 
         IsOptional, IsIn, IsDate, IsBoolean     
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePagoDto {
 
    @IsString()
    @MinLength(1)
    id_cuota: string;

    @IsString()
    @MinLength(1)
    id_prestamo: string;

    @IsNumber()
    @IsPositive()
    monto_pago: number;

    @IsDate()
    @Type(() => Date)
    fecha_pago: Date;

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
