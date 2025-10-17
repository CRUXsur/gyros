import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class DeviceCheckDto {
  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsBoolean()
  @IsOptional()
  validateConnection?: boolean = true;

  @IsString()
  @IsOptional()
  action?: string;
}