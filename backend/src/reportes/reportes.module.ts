import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Reporte } from './entities/reporte.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService],
  imports: [
    TypeOrmModule.forFeature([Reporte]),
    AuthModule
  ],
  exports: [
    TypeOrmModule,
    ReportesService
  ]
})
export class ReportesModule {}

