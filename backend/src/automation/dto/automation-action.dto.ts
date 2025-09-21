import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class AutomationActionDto {
  @IsString()
  @IsIn(['toggle_prestamo_status', 'execute_robot_action', 'check_device_only'])
  action: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsBoolean()
  @IsOptional()
  newStatus?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}