import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateClienteDto {

    @IsString()
    @MinLength(1)
    nombres: string;

    // @IsString()
    // @MinLength(1)
    // apellidos: string;

    @IsString()
    @MinLength(1)
    ci: string;

    @IsString()
    @MinLength(1)
    imei: string;

    @IsString()
    @MinLength(1)
    telefono: string;

    @IsString()
    @IsEmail()
    email: string;

    // @IsString()
    // @MinLength(1)
    // direccion: string;

    // @IsString()
    // @MinLength(1)
    // ciudad: string;

    // @IsString()
    // @MinLength(1)
    // pais: string;

    // @IsString()
    // @MinLength(1)
    // edad: string;

    @IsString({ each: true })
    @IsArray()
    sexo: string[];

    @IsString({ each: true })
    @IsArray()
    estado_civil: string[];

    // @IsString()
    // @MinLength(1)
    // ocupacion: string;

    // @IsNumber()
    // @IsPositive()
    // ingresos: number;

    // @IsNumber()
    // @IsPositive()
    // gastos: number;

    // @IsNumber()
    // @IsPositive()
    // ahorros: number;

    // @IsNumber()
    // @IsPositive()
    // deuda: number;

    // @IsNumber()
    // @IsPositive()
    // credito: number;

    // @IsString()
    // @MinLength(1)
    // tarjeta: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;


}
