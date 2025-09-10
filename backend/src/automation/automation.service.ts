import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AutomationLog } from './entities/automation-log.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { User } from '../auth/entities/user.entity';
import { PythonExecutorService } from './python-executor.service';
import { AutomationActionDto } from './dto/automation-action.dto';
import { 
  DeviceValidationResult, 
  OrchestrationResult,
  AutomationStatus 
} from './interfaces/automation-result.interface';



@Injectable()
export class AutomationService {
  private readonly logger = new Logger('AutomationService');

  constructor(
    @InjectRepository(AutomationLog)
    private readonly automationLogRepository: Repository<AutomationLog>,
    
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    
    private readonly pythonExecutorService: PythonExecutorService,
  ) {}

  async validateClienteDevice(deviceId: string): Promise<DeviceValidationResult> {
    this.logger.log(`Validando device_id: ${deviceId}`);

    try {
      // Buscar cliente por device_id
      const cliente = await this.clienteRepository.findOne({
        where: { device_id: deviceId },
      });

      if (!cliente) {
        return {
          isValid: false,
          cliente: null,
          hasActiveLoans: false,
          activeLoans: [],
          message: 'Cliente no encontrado con este device_id',
        };
      }

      // Buscar préstamos activos del cliente
      const activeLoans = await this.prestamoRepository.find({
        where: { 
          cliente: { id_cliente: cliente.id_cliente },
          isActive: true 
        },
        relations: ['cliente'],
      });

      return {
        isValid: true,
        cliente,
        hasActiveLoans: activeLoans.length > 0,
        activeLoans,
        message: activeLoans.length > 0 
          ? `Cliente encontrado con ${activeLoans.length} préstamo(s) activo(s)`
          : 'Cliente encontrado sin préstamos activos',
      };

    } catch (error) {
      this.logger.error(`Error validando device_id ${deviceId}:`, error);
      throw error;
    }
  }

  async orchestrateDeviceProcess(
    actionDto: AutomationActionDto, 
    user: User
  ): Promise<OrchestrationResult> {
    this.logger.log(`Iniciando proceso de orquestación: ${actionDto.action}`);

    try {
      // 1. Detectar dispositivo
      const deviceId = await this.pythonExecutorService.executeDeviceDetection();
      
      // 2. Validar cliente
      const validation = await this.validateClienteDevice(deviceId);
      
      if (!validation.isValid) {
        throw new NotFoundException(validation.message);
      }

      // 3. Ejecutar acción específica según el tipo
      let actionResult;
      
      switch (actionDto.action) {
        case 'toggle_prestamo_status':
          actionResult = await this.togglePrestamoStatus(
            validation.activeLoans[0]?.id_prestamo,
            actionDto.newStatus || false
          );
          break;
          
        case 'execute_robot_action':
          actionResult = await this.pythonExecutorService.executeRobotAction(deviceId);
          break;
          
        default:
          throw new Error(`Acción no válida: ${actionDto.action}`);
      }

      // 4. Registrar en log
      await this.logAutomationProcess({
        deviceId,
        action: actionDto.action,
        result: actionResult,
        success: true,
        cliente: validation.cliente,
        user,
      });

      return {
        success: true,
        deviceId,
        cliente: validation.cliente!,
        action: actionDto.action,
        result: actionResult,
        timestamp: new Date(),
      };

    } catch (error) {
      this.logger.error('Error en proceso de orquestación:', error);
      
      // Log del error
      await this.logAutomationProcess({
        deviceId: 'unknown',
        action: actionDto.action,
        result: { error: error.message },
        success: false,
        cliente: null,
        user,
      });
      
      throw error;
    }
  }

  async togglePrestamoStatus(prestamoId: string, newStatus: boolean): Promise<any> {
    if (!prestamoId) {
      throw new Error('No se encontró préstamo para actualizar');
    }

    const prestamo = await this.prestamoRepository.findOne({
      where: { id_prestamo: prestamoId },
    });

    if (!prestamo) {
      throw new NotFoundException(`Préstamo ${prestamoId} no encontrado`);
    }

    prestamo.isActive = newStatus;
    await this.prestamoRepository.save(prestamo);

    this.logger.log(`Préstamo ${prestamoId} actualizado a isActive: ${newStatus}`);
    
    return {
      prestamoId,
      previousStatus: !newStatus,
      newStatus,
      updatedAt: new Date(),
    };
  }

  async logAutomationProcess(logData: {
    deviceId: string;
    action: string;
    result: any;
    success: boolean;
    cliente: Cliente | null;
    user: User | null;
  }): Promise<AutomationLog> {
    try {
      // Crear el objeto base sin relaciones opcionales
      const logEntry: Partial<AutomationLog> = {
        deviceId: logData.deviceId,
        action: logData.action,
        result: logData.result,
        success: logData.success,
      };

      // Solo agregar cliente si no es null
      if (logData.cliente) {
        logEntry.cliente = logData.cliente;
      }

      // Solo agregar user si no es null
      if (logData.user) {
        logEntry.user = logData.user;
      }

      const log = this.automationLogRepository.create(logEntry);

      return await this.automationLogRepository.save(log);
    } catch (error) {
      this.logger.error('Error guardando log de automatización:', error);
      throw error;
    }
  }

  async getCurrentStatus(): Promise<AutomationStatus> {
    const recentLogs = await this.automationLogRepository.find({
      order: { timestamp: 'DESC' },
      take: 5,
      relations: ['cliente', 'user'],
    });

    return {
      systemStatus: 'operational',
      lastProcesses: recentLogs,
      totalProcessesToday: await this.getTodayProcessCount(),
      successRate: await this.getSuccessRate(),
    };
  }

  async getProcessHistory(limit: number = 10): Promise<AutomationLog[]> {
    return await this.automationLogRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
      relations: ['cliente', 'user'],
    });
  }

  private async getTodayProcessCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await this.automationLogRepository.count({
      where: {
        timestamp: today,
      },
    });
  }

  private async getSuccessRate(): Promise<number> {
    const total = await this.automationLogRepository.count();
    const successful = await this.automationLogRepository.count({
      where: { success: true },
    });
    
    return total > 0 ? (successful / total) * 100 : 0;
  }

  // ========================================
  // MÉTODOS DE CRON JOBS / TAREAS PROGRAMADAS
  // ========================================

  @Cron('0 * * * *') // Cada hora
  async hourlyDeviceCheck() {
    this.logger.log('🕐 Ejecutando verificación automática por hora...');
    
    try {
      // Verificar si hay dispositivos conectados
      const deviceId = await this.pythonExecutorService.executeDeviceDetection();
      
      if (deviceId) {
        // Validar cliente automáticamente
        const validation = await this.validateClienteDevice(deviceId);
        
        if (validation.isValid && validation.hasActiveLoans) {
          this.logger.log(`📱 Cliente detectado automáticamente: ${validation.cliente?.nombres} con ${validation.activeLoans.length} préstamo(s) activo(s)`);
          
          // Log de detección automática
          await this.logAutomationProcess({
            deviceId,
            action: 'hourly_device_check',
            result: {
              cliente: validation.cliente,
              activeLoans: validation.activeLoans.length,
              timestamp: new Date(),
            },
            success: true,
            cliente: validation.cliente,
            user: null, // Sistema automático
          });
        }
      }
    } catch (error) {
      this.logger.warn(`⚠️ Verificación automática falló: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Todos los días a medianoche
  async dailyReportGeneration() {
    this.logger.log('🌙 Generando reporte diario de automatización...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayLogs = await this.automationLogRepository.find({
        where: {
          timestamp: today,
        },
        relations: ['cliente', 'user'],
      });

      const report = {
        date: today.toISOString().split('T')[0],
        totalProcesses: todayLogs.length,
        successfulProcesses: todayLogs.filter(log => log.success).length,
        failedProcesses: todayLogs.filter(log => !log.success).length,
        uniqueDevices: [...new Set(todayLogs.map(log => log.deviceId))].length,
        uniqueClientes: [...new Set(todayLogs.filter(log => log.cliente).map(log => log.cliente?.id_cliente))].length,
      };

      this.logger.log(`📊 Reporte diario generado: ${JSON.stringify(report, null, 2)}`);
      
      // Log del reporte
      await this.logAutomationProcess({
        deviceId: 'system',
        action: 'daily_report',
        result: report,
        success: true,
        cliente: null,
        user: null,
      });

    } catch (error) {
      this.logger.error(`❌ Error generando reporte diario: ${error.message}`);
    }
  }

  @Cron('0 0 1 * *') // Primer día de cada mes a medianoche
  async monthlyMaintenance() {
    this.logger.log('🔧 Ejecutando mantenimiento mensual...');
    
    try {
      // Limpiar logs antiguos (mayor a 3 meses)
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const deletedLogs = await this.automationLogRepository
        .createQueryBuilder()
        .delete()
        .where('timestamp < :date', { date: threeMonthsAgo })
        .execute();

      this.logger.log(`🗑️ Limpieza completada: ${deletedLogs.affected} logs eliminados`);
      
      // Log de mantenimiento
      await this.logAutomationProcess({
        deviceId: 'system',
        action: 'monthly_maintenance',
        result: {
          deletedLogs: deletedLogs.affected,
          cleanupDate: threeMonthsAgo,
          maintenanceDate: new Date(),
        },
        success: true,
        cliente: null,
        user: null,
      });

    } catch (error) {
      this.logger.error(`❌ Error en mantenimiento mensual: ${error.message}`);
    }
  }

  // Método manual para triggers de testing
  async triggerScheduledCheck(): Promise<any> {
    this.logger.log('🔧 Ejecutando verificación manual programada...');
    await this.hourlyDeviceCheck();
    return { message: 'Verificación programada ejecutada manualmente' };
  }
}