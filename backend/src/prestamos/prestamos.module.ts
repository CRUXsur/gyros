import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';

import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';

import { Prestamo, PrestamoImage } from './entities';
import { Cliente } from '../clientes/entities/cliente.entity';


@Module({
  controllers: [PrestamosController],
  providers: [PrestamosService],
  imports:[
    TypeOrmModule.forFeature([Prestamo, PrestamoImage, Cliente]),
    AuthModule
  ],
  exports: [
    PrestamosService,
    TypeOrmModule
  ]
})
export class PrestamosModule {}
