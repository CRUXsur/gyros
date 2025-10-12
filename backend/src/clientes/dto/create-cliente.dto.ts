import { IsArray, IsBoolean, IsDate, IsEmail, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Transform, Type } from "class-transformer";



export class CreateClienteDto {

    @IsString()
    @MinLength(1)
    nombres: string;

    @IsString()
    @MinLength(1)
    apellidos: string;

    @IsString()
    @IsIn(['Bolivianos', 'Dolares'])
    moneda?: string;

    @IsNumber()
    @IsPositive()
    aporte_mensual: number;

    @IsString()
    @MinLength(1)
    numero_cuenta: string;

    @IsString()
    @IsIn(['BCP', 'Bco.UNION', 'Coopertiva'])
    banco?: string;

    @IsDate()
    @Type(() => Date)
    fecha_vto_tarjeta?: Date;


    @IsDate()
    @Type(() => Date)
    @IsOptional()
    fecha_registro?: Date;

    @IsString()
    @MinLength(1)
    ci: string;
    
    @IsString()
    @MinLength(1)
    fijo: string;

    @IsString()
    @MinLength(1)
    celular: string;

    @IsString()
    @IsEmail()
    email: string;



    @IsString()
    @MinLength(1)
    device_id: string;





    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsString()
    observaciones: string;



    @IsString()
    garante: string;

    @IsString()
    Celular_garante: string;


}
