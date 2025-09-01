import { IsString, MinLength, IsNumber, IsPositive, 
         IsOptional, IsInt, IsArray, IsIn 
} from "class-validator";



export class CreatePrestamoDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    monto?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    nocuotas?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    capital?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    interes?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    saldo?: number;
    
    // @IsString()
    // @MinLength(1)
    // title: string;

    // @IsNumber()
    // @IsPositive()
    // @IsOptional()
    // price?: number;
    
    // @IsString()
    // @IsOptional()
    // description?: string;
    
    // @IsString()
    // @IsOptional()
    // slug?: string;
    
    // @IsInt()
    // @IsPositive()
    // @IsOptional()
    // stock?: number;

    // @IsString({ each: true })
    // @IsArray()
    // sizes: string[];

    // @IsIn(['men', 'women', 'kid', 'unisex'])
    // gender: string;

    // @IsString({ each: true })
    // @IsArray()
    // @IsOptional()
    // tags?: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
