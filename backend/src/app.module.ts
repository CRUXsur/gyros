import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PrestamosModule } from './prestamos/prestamos.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { CuotasModule } from './cuotas/cuotas.module';
import { PagosModule } from './pagos/pagos.module';
import { AutomationModule } from './automation/automation.module';
import { BancosModule } from './bancos/bancos.module';
import { BancoClienteModule } from './banco-cliente/banco-cliente.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
        ? {rejectUnauthorized: false,}
        : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'gyros_db',
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PrestamosModule,
    CommonModule,
    SeedModule,
    AuthModule,
    ClientesModule,
    CuotasModule,
    PagosModule,
    AutomationModule,
    BancosModule,
    BancoClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
