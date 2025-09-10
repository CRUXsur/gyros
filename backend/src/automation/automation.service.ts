import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationLog } from './entities/automation-log.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { User } from '../auth/entities/user.entity';
import { PythonExecutorService } from './python-executor.service';
import { AutomationActionDto } from './dto/automation-action.dto';
import { DeviceValidationResult } from './interfaces/automation-result.interface';
import { OrchestrationResult,AutomationStatus } from './interfaces/automation-result.interface';



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
    user: User;
  }): Promise<AutomationLog> {
    try {
      // Crear el objeto base sin cliente
      const logEntry: Partial<AutomationLog> = {
        deviceId: logData.deviceId,
        action: logData.action,
        result: logData.result,
        success: logData.success,
        user: logData.user,
      };

      // Solo agregar cliente si no es null
      if (logData.cliente) {
        logEntry.cliente = logData.cliente;
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
}