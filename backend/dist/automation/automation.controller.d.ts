import { AutomationService } from './automation.service';
import { PythonExecutorService } from './python-executor.service';
import { AutomationActionDto } from './dto/automation-action.dto';
import { User } from '../auth/entities/user.entity';
export declare class AutomationController {
    private readonly automationService;
    private readonly pythonExecutorService;
    private readonly logger;
    constructor(automationService: AutomationService, pythonExecutorService: PythonExecutorService);
    checkDeviceId(): Promise<{
        success: boolean;
        deviceId: string;
        cliente: import("../clientes/entities/cliente.entity").Cliente | null;
        hasActiveLoans: boolean;
        activeLoans: import("../prestamos/entities").Prestamo[];
        message: string;
        reason?: undefined;
    } | {
        success: boolean;
        reason: any;
        deviceId: null;
        cliente?: undefined;
        hasActiveLoans?: undefined;
        activeLoans?: undefined;
        message?: undefined;
    }>;
    startAutomationProcess(automationActionDto: AutomationActionDto, user: User): Promise<{
        success: boolean;
        result: import("./interfaces/automation-result.interface").OrchestrationResult;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        result?: undefined;
    }>;
    getAutomationStatus(): Promise<import("./interfaces/automation-result.interface").AutomationStatus>;
    getProcessHistory(limit?: number): Promise<import("./entities/automation-log.entity").AutomationLog[]>;
    validateSpecificDevice(deviceId: string): Promise<{
        success: boolean;
        deviceId: string;
        isValid: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        deviceId: string;
        isValid: boolean;
        error: any;
        message?: undefined;
    }>;
    triggerScheduledCheck(): Promise<{
        success: boolean;
        message: string;
        result: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        result?: undefined;
    }>;
    getDailyStats(): Promise<{
        success: boolean;
        stats: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        stats?: undefined;
    }>;
    getDeviceStats(): Promise<{
        success: boolean;
        stats: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        stats?: undefined;
    }>;
    getPerformanceStats(): Promise<{
        success: boolean;
        stats: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        stats?: undefined;
    }>;
    getHealthCheck(): Promise<{
        success: boolean;
        health: any;
        timestamp: Date;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        health?: undefined;
        timestamp?: undefined;
    }>;
    executeRobotScript(user: User): Promise<{
        success: boolean;
        result: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        result?: undefined;
    }>;
    executeTransferRobot(variables: {
        usuario: string;
        password: string;
        bs: string;
        glosa: string;
    }): Promise<{
        success: any;
        deviceId: any;
        deviceInfo: any;
        saldoInicial: any;
        saldoFinal: any;
        result: any;
        message: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        deviceId?: undefined;
        deviceInfo?: undefined;
        saldoInicial?: undefined;
        saldoFinal?: undefined;
        result?: undefined;
    }>;
}
