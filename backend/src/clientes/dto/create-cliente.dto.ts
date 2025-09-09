import { IsArray, IsBoolean, IsDate, IsEmail, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateClienteDto {

    @IsString()
    @MinLength(1)
    nombres: string;

    @IsString()
    @MinLength(1)
    apellidos: string;

    @IsString()
    @MinLength(1)
    ci: string;

    // @IsString()
    // @MinLength(1)
    // imei: string;
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    telefono: string;

    @IsString()
    @MinLength(1)
    device_id: string;

    @IsString()
    @MinLength(1)
    direccion: string;

    @IsString()
    @IsIn(['hombre', 'mujer', 'no_especificado'])
    @IsOptional()
    sexo?: string;

    @IsString()
    @IsIn(['soltero', 'casado', 'divorciado', 'viudo'])
    @IsOptional()
    estado_civil?: string;

    @IsDate()
    fecha_registro: Date;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    // @IsString()
    // @MinLength(1)
    // ciudad: string;

    // @IsString()
    // @MinLength(1)
    // pais: string;

    // @IsString()
    // @MinLength(1)
    // edad: string;

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


}
