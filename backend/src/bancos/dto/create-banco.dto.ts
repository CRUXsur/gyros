import { IsString, MinLength, IsOptional, IsBoolean } from "class-validator";

export class CreateBancoDto {
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

