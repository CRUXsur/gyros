import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { AuthModule } from '../auth/auth.module';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';


@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
  imports: [
    TypeOrmModule.forFeature([Cliente, Prestamo, Cuota]),
    AuthModule
  ],
  exports: [
    ClientesService,
    TypeOrmModule
  ]
})
export class ClientesModule {}
