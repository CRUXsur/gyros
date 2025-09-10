import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Cuota } from '../cuotas/entities/cuota.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PagosController],
  providers: [PagosService],
  imports: [
    TypeOrmModule.forFeature([Pago, Cuota, Prestamo]),
    AuthModule
  ],
  exports: [
    TypeOrmModule,
    PagosService
  ]
})
export class PagosModule {}