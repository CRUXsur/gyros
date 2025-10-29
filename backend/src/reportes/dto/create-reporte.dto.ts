import { IsNumber, IsPositive, IsOptional, IsBoolean } from "class-validator";

export class CreateReporteDto {
    @IsNumber()
    @IsPositive()
    capital_prestado: number;

    @IsNumber()
    @IsPositive()
    intereses: number;

    @IsNumber()
    @IsPositive()
    capital_disponible: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

