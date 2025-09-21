import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param,
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { PythonExecutorService } from './python-executor.service';
import { DeviceCheckDto } from './dto/device-check.dto';
import { AutomationActionDto } from './dto/automation-action.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';

@Controller('automation')
export class AutomationController {
    constructor(
      private readonly automationService: AutomationService,
      private readonly pythonExecutorService: PythonExecutorService,
    ) {}
  
    @Get('check-device-id')
    @Auth()
    async checkDeviceId() {
      try {
        // 1. Ejecutar Python para obtener device_id del USB
        const deviceId = await this.pythonExecutorService.executeDeviceDetection();
        
        // 2. NestJS busca en DB si existe cliente con ese device_id
        const result = await this.automationService.validateClienteDevice(deviceId);
        
        return {
          success: true,
          deviceId,
          cliente: result.cliente,
          hasActiveLoans: result.hasActiveLoans,
          activeLoans: result.activeLoans,
          message: result.message,
        };
        
      } catch (error) {
        return {
          success: false,
          reason: error.message,
          deviceId: null,
        };
      }
    }
  
    @Post('start-process')
    @Auth()
    @HttpCode(HttpStatus.OK)
    async startAutomationProcess(
      @Body() automationActionDto: AutomationActionDto,
      @GetUser() user: User,
    ) {
      try {
        // Orquestar proceso completo
        const result = await this.automationService.orchestrateDeviceProcess(
          automationActionDto,
          user,
        );
        
        return {
          success: true,
          result,
          message: 'Proceso de automatización completado exitosamente',
        };
        
      } catch (error) {
        return {
          success: false,
          error: error.message,
          message: 'Error en el proceso de automatización',
        };
      }
    }
  
    @Get('status')
    @Auth()
    async getAutomationStatus() {
      return await this.automationService.getCurrentStatus();
    }
  
    @Get('history')
    @Auth(ValidRoles.admin)
    async getProcessHistory(@Query('limit') limit?: number) {
      return await this.automationService.getProcessHistory(limit || 10);
    }
  
    @Get('validate-device/:deviceId')
    @Auth()
    async validateSpecificDevice(@Param('deviceId') deviceId: string) {
      try {
        const isValid = await this.pythonExecutorService.checkDeviceConnection(deviceId);
        return {
          success: true,
          deviceId,
          isValid,
          message: isValid ? 'Dispositivo válido' : 'Dispositivo no válido',
        };
      } catch (error) {
      return {
        success: false,
        deviceId,
        isValid: false,
        error: error.message,
      };
    }
  }

  @Post('trigger-scheduled-check')
  @Auth(ValidRoles.admin)
  async triggerScheduledCheck() {
    try {
      const result = await this.automationService.triggerScheduledCheck();
      return {
        success: true,
        message: 'Verificación programada ejecutada manualmente',
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error ejecutando verificación programada',
      };
    }
  }

  @Get('stats/daily')
  @Auth()
  async getDailyStats() {
    try {
      const stats = await this.automationService.getDailyStatistics();
      return {
        success: true,
        stats,
        message: 'Estadísticas diarias obtenidas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error obteniendo estadísticas diarias',
      };
    }
  }

  @Get('stats/devices')
  @Auth()
  async getDeviceStats() {
    try {
      const stats = await this.automationService.getDeviceStatistics();
      return {
        success: true,
        stats,
        message: 'Estadísticas de dispositivos obtenidas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error obteniendo estadísticas de dispositivos',
      };
    }
  }

  @Get('stats/performance')
  @Auth(ValidRoles.admin)
  async getPerformanceStats() {
    try {
      const stats = await this.automationService.getPerformanceStatistics();
      return {
        success: true,
        stats,
        message: 'Estadísticas de rendimiento obtenidas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error obteniendo estadísticas de rendimiento',
      };
    }
  }

  @Get('health')
  async getHealthCheck() {
    try {
      const health = await this.automationService.getSystemHealth();
      return {
        success: true,
        health,
        timestamp: new Date(),
        message: 'Sistema operacional',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error en verificación de salud del sistema',
      };
    }
  }

  // ------------------------------------------------------------------------------------------------
  // ... existing code ...

  @Post('execute-robot-script')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async executeRobotScript(@GetUser() user: User) {
    try {
      const result = await this.automationService.executeRobotScript('Add_Note_Test.robot');
      
      return {
        success: true,
        result,
        message: 'Script de Robot Framework ejecutado exitosamente',
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error ejecutando script de Robot Framework',
      };
    }
  } 
}



