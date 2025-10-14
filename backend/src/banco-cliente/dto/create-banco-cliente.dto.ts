import { IsString, MinLength, IsOptional, IsBoolean, IsUUID } from "class-validator";

export class CreateBancoClienteDto {
    @IsUUID()
    clienteId: string;

    @IsString()
    @MinLength(1)
    banco: string;

    @IsString()
    @MinLength(1)
    noCta: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    moneda: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
