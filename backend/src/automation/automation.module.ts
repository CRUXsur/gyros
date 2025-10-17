import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { PythonExecutorService } from './python-executor.service';
import { AutomationLog } from './entities/automation-log.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { PrestamosModule } from '../prestamos/prestamos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AutomationController],
  providers: [AutomationService, PythonExecutorService],
  imports: [
    TypeOrmModule.forFeature([AutomationLog]),
    ClientesModule,
    PrestamosModule,
    AuthModule,
  ],
  exports: [AutomationService, PythonExecutorService],
})
export class AutomationModule {}