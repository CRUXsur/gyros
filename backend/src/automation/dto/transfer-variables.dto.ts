import { IsString, IsNotEmpty } from 'class-validator';

export class TransferVariablesDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  bs: string;

  @IsString()
  @IsNotEmpty()
  glosa: string;
}
