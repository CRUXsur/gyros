import { IsString, MinLength, IsNumber, IsPositive, 
         IsOptional, IsInt, IsArray, IsIn, IsDate, IsBoolean     
} from "class-validator";
import { Type } from "class-transformer";



export class CreatePrestamoDto {
 
    @IsString()
    @MinLength(1)
    id_cliente: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    monto_prestado?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    tasa_interes?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    plazo_meses?: number;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_prestamo?: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_vencimiento?: Date;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
