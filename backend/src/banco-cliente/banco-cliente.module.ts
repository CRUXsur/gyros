import { Module } from '@nestjs/common';
import { BancoClienteService } from './banco-cliente.service';
import { BancoClienteController } from './banco-cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BancoCliente } from './entities/banco-cliente.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BancoClienteController],
  providers: [BancoClienteService],
  imports: [
    TypeOrmModule.forFeature([BancoCliente, Cliente]),
    AuthModule,
  ],
  exports: [BancoClienteService, TypeOrmModule],
})
export class BancoClienteModule {}
