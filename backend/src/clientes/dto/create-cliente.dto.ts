import { IsArray, IsBoolean, IsDate, IsEmail, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Transform, Type } from "class-transformer";



export class CreateClienteDto {

    @IsString()
    @MinLength(1)
    nombrecompleto: string;

    @IsString()
    @MinLength(1)
    ci: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    celular?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    fijo?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @MinLength(1)
    @IsOptional()
    device_id?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_vto_tarjeta?: Date;

    @IsString()
    @IsOptional()
    sector?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    codigo?: string;

    @IsString()
    @IsIn(['BCP', 'Bco.UNION', 'Coopertiva', 'BNB'])
    @IsOptional()
    banco?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    numero_cuenta?: string;

    @IsString()
    @IsIn(['Bolivianos', 'Dolares'])
    moneda?: string;

    @IsString()
    @IsOptional()
    garante?: string;

    @IsString()
    @IsOptional()
    celular_garante?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_registro?: Date;


    // @IsString()
    // @IsEmail()
    // @IsOptional()
    // email?: string;


}
