import { IsString, MinLength, IsNumber, IsPositive, 
         IsOptional, IsInt, IsIn, IsDate, IsBoolean     
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCuotaDto {
 
    @IsString()
    @MinLength(1)
    id_prestamo: string;

    @IsInt()
    @IsPositive()
    numero_cuota: number;

    @IsNumber()
    @IsPositive()
    monto_cuota: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    monto_pagado?: number;

    @IsDate()
    @Type(() => Date)
    fecha_vencimiento: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_pago?: Date;

    @IsString()
    @IsIn(['pendiente', 'pagado', 'vencido'])
    @IsOptional()
    estado?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}