import { PartialType } from '@nestjs/mapped-types';
import { CreateBancoClienteDto } from './create-banco-cliente.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateBancoClienteDto extends PartialType(CreateBancoClienteDto) {
    @IsUUID()
    @IsOptional()
    clienteId?: string;
}
