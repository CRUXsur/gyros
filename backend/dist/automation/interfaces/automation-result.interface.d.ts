import { Cliente } from '../../clientes/entities/cliente.entity';
import { Prestamo } from '../../prestamos/entities/prestamo.entity';
import { AutomationLog } from '../entities/automation-log.entity';
export interface DeviceValidationResult {
    isValid: boolean;
    cliente: Cliente | null;
    hasActiveLoans: boolean;
    activeLoans: Prestamo[];
    message: string;
}
export interface OrchestrationResult {
    success: boolean;
    deviceId: string;
    cliente: Cliente;
    action: string;
    result: any;
    timestamp: Date;
}
export interface AutomationStatus {
    systemStatus: string;
    lastProcesses: AutomationLog[];
    totalProcessesToday: number;
    successRate: number;
}
export interface PythonExecutionResult {
    success: boolean;
    output?: any;
    error?: string;
    timestamp: Date;
}
