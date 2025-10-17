import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { BancosModule } from '../bancos/bancos.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [BancosModule],
})
export class SeedModule {}
