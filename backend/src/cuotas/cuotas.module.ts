import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuotasService } from './cuotas.service';
import { CuotasController } from './cuotas.controller';
import { Cuota } from './entities/cuota.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CuotasController],
  providers: [CuotasService],
  imports: [
    TypeOrmModule.forFeature([Cuota, Prestamo]),
    AuthModule
  ],
  exports: [
    TypeOrmModule,
    CuotasService
  ]
})
export class CuotasModule {}