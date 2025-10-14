import { Module } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { BancosController } from './bancos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banco } from './entities/banco.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BancosController],
  providers: [BancosService],
  imports: [
    TypeOrmModule.forFeature([Banco]),
    AuthModule
  ],
  exports: [
    BancosService,
    TypeOrmModule
  ]
})
export class BancosModule {}

