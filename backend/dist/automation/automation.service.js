"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const automation_log_entity_1 = require("./entities/automation-log.entity");
const cliente_entity_1 = require("../clientes/entities/cliente.entity");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const python_executor_service_1 = require("./python-executor.service");
let AutomationService = class AutomationService {
    automationLogRepository;
    clienteRepository;
    prestamoRepository;
    pythonExecutorService;
    logger = new common_1.Logger('AutomationService');
    constructor(automationLogRepository, clienteRepository, prestamoRepository, pythonExecutorService) {
        this.automationLogRepository = automationLogRepository;
        this.clienteRepository = clienteRepository;
        this.prestamoRepository = prestamoRepository;
        this.pythonExecutorService = pythonExecutorService;
    }
    async validateClienteDevice(deviceId) {
        this.logger.log(`Validando device_id: ${deviceId}`);
        try {
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
        }
        catch (error) {
            this.logger.error(`Error validando device_id ${deviceId}:`, error);
            throw error;
        }
    }
    async orchestrateDeviceProcess(actionDto, user) {
        this.logger.log(`Iniciando proceso de orquestación: ${actionDto.action}`);
        try {
            const deviceId = await this.pythonExecutorService.executeDeviceDetection();
            const validation = await this.validateClienteDevice(deviceId);
            if (!validation.isValid) {
                throw new common_1.NotFoundException(validation.message);
            }
            let actionResult;
            switch (actionDto.action) {
                case 'toggle_prestamo_status':
                    actionResult = await this.togglePrestamoStatus(validation.activeLoans[0]?.id_prestamo, actionDto.newStatus || false);
                    break;
                case 'execute_robot_action':
                    actionResult = await this.pythonExecutorService.executeAutomationInterface('make_action');
                    break;
                default:
                    throw new Error(`Acción no válida: ${actionDto.action}`);
            }
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
                cliente: validation.cliente,
                action: actionDto.action,
                result: actionResult,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error en proceso de orquestación:', error);
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
    async togglePrestamoStatus(prestamoId, newStatus) {
        if (!prestamoId) {
            throw new Error('No se encontró préstamo para actualizar');
        }
        const prestamo = await this.prestamoRepository.findOne({
            where: { id_prestamo: prestamoId },
        });
        if (!prestamo) {
            throw new common_1.NotFoundException(`Préstamo ${prestamoId} no encontrado`);
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
    async logAutomationProcess(logData) {
        try {
            const logEntry = {
                deviceId: logData.deviceId,
                action: logData.action,
                result: logData.result,
                success: logData.success,
            };
            if (logData.cliente) {
                logEntry.cliente = logData.cliente;
            }
            if (logData.user) {
                logEntry.user = logData.user;
            }
            const log = this.automationLogRepository.create(logEntry);
            return await this.automationLogRepository.save(log);
        }
        catch (error) {
            this.logger.error('Error guardando log de automatización:', error);
            throw error;
        }
    }
    async getCurrentStatus() {
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
    async getProcessHistory(limit = 10) {
        return await this.automationLogRepository.find({
            order: { timestamp: 'DESC' },
            take: limit,
            relations: ['cliente', 'user'],
        });
    }
    async getTodayProcessCount() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await this.automationLogRepository.count({
            where: {
                timestamp: today,
            },
        });
    }
    async getSuccessRate() {
        const total = await this.automationLogRepository.count();
        const successful = await this.automationLogRepository.count({
            where: { success: true },
        });
        return total > 0 ? (successful / total) * 100 : 0;
    }
    async hourlyDeviceCheck() {
        this.logger.log('🕐 Ejecutando verificación automática por hora...');
        try {
            const deviceId = await this.pythonExecutorService.executeDeviceDetection();
            if (deviceId) {
                const validation = await this.validateClienteDevice(deviceId);
                if (validation.isValid && validation.hasActiveLoans) {
                    this.logger.log(`📱 Cliente detectado automáticamente: ${validation.cliente?.nombrecompleto} con ${validation.activeLoans.length} préstamo(s) activo(s)`);
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
                        user: null,
                    });
                }
            }
        }
        catch (error) {
            this.logger.warn(`⚠️ Verificación automática falló: ${error.message}`);
        }
    }
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
            await this.logAutomationProcess({
                deviceId: 'system',
                action: 'daily_report',
                result: report,
                success: true,
                cliente: null,
                user: null,
            });
        }
        catch (error) {
            this.logger.error(`❌ Error generando reporte diario: ${error.message}`);
        }
    }
    async monthlyMaintenance() {
        this.logger.log('🔧 Ejecutando mantenimiento mensual...');
        try {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const deletedLogs = await this.automationLogRepository
                .createQueryBuilder()
                .delete()
                .where('timestamp < :date', { date: threeMonthsAgo })
                .execute();
            this.logger.log(`🗑️ Limpieza completada: ${deletedLogs.affected} logs eliminados`);
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
        }
        catch (error) {
            this.logger.error(`❌ Error en mantenimiento mensual: ${error.message}`);
        }
    }
    async triggerScheduledCheck() {
        this.logger.log('🔧 Ejecutando verificación manual programada...');
        await this.hourlyDeviceCheck();
        return { message: 'Verificación programada ejecutada manualmente' };
    }
    async getDailyStatistics() {
        this.logger.log('📊 Generando estadísticas diarias...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayLogs = await this.automationLogRepository
            .createQueryBuilder('log')
            .where('log.timestamp >= :today AND log.timestamp < :tomorrow', {
            today,
            tomorrow,
        })
            .getMany();
        const stats = {
            date: today.toISOString().split('T')[0],
            totalProcesses: todayLogs.length,
            successfulProcesses: todayLogs.filter(log => log.success).length,
            failedProcesses: todayLogs.filter(log => !log.success).length,
            uniqueDevices: [...new Set(todayLogs.map(log => log.deviceId))].length,
            processesPerHour: this.getProcessesPerHour(todayLogs),
            actionBreakdown: this.getActionBreakdown(todayLogs),
            errorTypes: this.getErrorTypes(todayLogs),
        };
        return stats;
    }
    async getDeviceStatistics() {
        this.logger.log('📱 Generando estadísticas de dispositivos...');
        const logs = await this.automationLogRepository
            .createQueryBuilder('log')
            .select(['log.deviceId', 'log.timestamp', 'log.success', 'log.action'])
            .orderBy('log.timestamp', 'DESC')
            .limit(1000)
            .getMany();
        const deviceStats = {};
        logs.forEach(log => {
            if (!deviceStats[log.deviceId]) {
                deviceStats[log.deviceId] = {
                    deviceId: log.deviceId,
                    totalProcesses: 0,
                    successfulProcesses: 0,
                    lastSeen: null,
                    actions: {},
                };
            }
            const device = deviceStats[log.deviceId];
            device.totalProcesses++;
            if (log.success)
                device.successfulProcesses++;
            if (!device.lastSeen || log.timestamp > device.lastSeen) {
                device.lastSeen = log.timestamp;
            }
            device.actions[log.action] = (device.actions[log.action] || 0) + 1;
        });
        return {
            totalDevices: Object.keys(deviceStats).length,
            devices: Object.values(deviceStats),
            mostActiveDevice: this.getMostActiveDevice(deviceStats),
        };
    }
    async getPerformanceStatistics() {
        this.logger.log('⚡ Generando estadísticas de rendimiento...');
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const recentLogs = await this.automationLogRepository
            .createQueryBuilder('log')
            .where('log.timestamp >= :date', { date: last7Days })
            .orderBy('log.timestamp', 'DESC')
            .getMany();
        const performanceStats = {
            period: '7 days',
            totalProcesses: recentLogs.length,
            averageProcessesPerDay: recentLogs.length / 7,
            successRate: this.calculateSuccessRate(recentLogs),
            processingTimes: this.estimateProcessingTimes(recentLogs),
            peakHours: this.getPeakHours(recentLogs),
            reliability: this.calculateReliability(recentLogs),
        };
        return performanceStats;
    }
    async getSystemHealth() {
        this.logger.log('🏥 Verificando salud del sistema...');
        try {
            const dbCheck = await this.automationLogRepository.count();
            const lastProcess = await this.automationLogRepository
                .createQueryBuilder('log')
                .orderBy('log.timestamp', 'DESC')
                .limit(1)
                .getOne();
            const pythonCheck = await this.pythonExecutorService.executeAutomationInterface('check_device')
                .then(() => true)
                .catch(() => false);
            return {
                database: {
                    status: dbCheck >= 0 ? 'healthy' : 'error',
                    totalLogs: dbCheck,
                },
                automation: {
                    status: lastProcess ? 'active' : 'inactive',
                    lastProcess: lastProcess?.timestamp,
                    lastSuccess: lastProcess?.success,
                },
                pythonRobot: {
                    status: pythonCheck ? 'healthy' : 'error',
                    message: pythonCheck ? 'Python/Robot operacional' : 'Error en Python/Robot',
                },
                systemStatus: (dbCheck >= 0 && pythonCheck) ? 'healthy' : 'degraded',
            };
        }
        catch (error) {
            this.logger.error('Error en verificación de salud:', error);
            return {
                systemStatus: 'error',
                error: error.message,
            };
        }
    }
    getProcessesPerHour(logs) {
        const hourlyData = {};
        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hourlyData[hour] = (hourlyData[hour] || 0) + 1;
        });
        return hourlyData;
    }
    getActionBreakdown(logs) {
        const actions = {};
        logs.forEach(log => {
            actions[log.action] = (actions[log.action] || 0) + 1;
        });
        return actions;
    }
    getErrorTypes(logs) {
        const errors = {};
        logs.filter(log => !log.success).forEach(log => {
            const errorType = log.result?.error || 'Unknown error';
            errors[errorType] = (errors[errorType] || 0) + 1;
        });
        return errors;
    }
    getMostActiveDevice(deviceStats) {
        const devices = Object.values(deviceStats);
        return devices.sort((a, b) => b.totalProcesses - a.totalProcesses)[0] || null;
    }
    calculateSuccessRate(logs) {
        if (logs.length === 0)
            return 0;
        const successful = logs.filter(log => log.success).length;
        return Math.round((successful / logs.length) * 100 * 100) / 100;
    }
    estimateProcessingTimes(logs) {
        const timeEstimates = {
            'check_device': 1.2,
            'execute_robot_action': 3.5,
            'toggle_prestamo_status': 0.8,
            'hourly_device_check': 2.1,
        };
        const breakdown = {};
        logs.forEach(log => {
            breakdown[log.action] = timeEstimates[log.action] || 2.0;
        });
        const values = Object.values(breakdown);
        return {
            averageTime: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            byAction: breakdown,
        };
    }
    getPeakHours(logs) {
        const hourlyActivity = this.getProcessesPerHour(logs);
        const sortedHours = Object.entries(hourlyActivity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
        return {
            peakHour: sortedHours[0] ? `${sortedHours[0][0]}:00` : 'N/A',
            top3Hours: sortedHours.map(([hour, count]) => ({
                hour: `${hour}:00`,
                processes: count,
            })),
        };
    }
    calculateReliability(logs) {
        const last24h = logs.filter(log => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return new Date(log.timestamp) >= yesterday;
        });
        return {
            last24Hours: {
                totalProcesses: last24h.length,
                successRate: this.calculateSuccessRate(last24h),
                status: this.calculateSuccessRate(last24h) >= 95 ? 'excellent' :
                    this.calculateSuccessRate(last24h) >= 80 ? 'good' : 'needs_attention',
            },
        };
    }
    async executeRobotScript(scriptName) {
        this.logger.log(`Ejecutando script de Robot Framework: ${scriptName}`);
        try {
            const { spawn } = require('child_process');
            const path = require('path');
            const robotPath = path.join(process.cwd(), '..', 'robot');
            const scriptPath = path.join(robotPath, 'Test', scriptName);
            this.logger.log(`Ruta del script: ${scriptPath}`);
            return new Promise((resolve, reject) => {
                const robotProcess = spawn('robot', [scriptPath], {
                    cwd: robotPath,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                let stdout = '';
                let stderr = '';
                robotProcess.stdout.on('data', (data) => {
                    stdout += data.toString();
                    this.logger.log(`Robot stdout: ${data.toString()}`);
                });
                robotProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                    this.logger.error(`Robot stderr: ${data.toString()}`);
                });
                robotProcess.on('close', (code) => {
                    this.logger.log(`Robot process exited with code: ${code}`);
                    const result = {
                        success: code === 0,
                        exitCode: code,
                        stdout: stdout,
                        stderr: stderr,
                        scriptName: scriptName,
                        timestamp: new Date(),
                        message: code === 0 ? 'Script ejecutado exitosamente' : 'Script falló en la ejecución'
                    };
                    resolve(result);
                });
                robotProcess.on('error', (error) => {
                    this.logger.error(`Error ejecutando Robot Framework: ${error.message}`);
                    reject(new Error(`Error ejecutando Robot Framework: ${error.message}`));
                });
            });
        }
        catch (error) {
            this.logger.error(`Error en executeRobotScript: ${error.message}`);
            throw new Error(`Error ejecutando script de Robot Framework: ${error.message}`);
        }
    }
    async executeTransferRobot(variables) {
        this.logger.log(`Ejecutando transfer.robot con variables del formulario`);
        this.logger.log(`Variables: usuario=${variables.usuario}, bs=${variables.bs}, glosa=${variables.glosa}`);
        try {
            const { spawn } = require('child_process');
            const path = require('path');
            const movilbotPath = path.join(process.cwd(), '..', 'movilbot');
            const scriptPath = path.join(movilbotPath, 'transfer.robot');
            this.logger.log(`Ruta del script: ${scriptPath}`);
            this.logger.log(`Directorio de trabajo: ${movilbotPath}`);
            return new Promise((resolve, reject) => {
                const args = [
                    '-v', `usuario:${variables.usuario}`,
                    '-v', `password:${variables.password}`,
                    '-v', `bs:${variables.bs}`,
                    '-v', `glosa:${variables.glosa}`,
                    'transfer.robot'
                ];
                this.logger.log(`Comando: robot ${args.join(' ')}`);
                const robotProcess = spawn('robot', args, {
                    cwd: movilbotPath,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                let stdout = '';
                let stderr = '';
                let detectedDeviceId = null;
                let deviceInfo = {};
                let saldoInicial = null;
                let saldoFinal = null;
                robotProcess.stdout.on('data', (data) => {
                    const output = data.toString();
                    stdout += output;
                    this.logger.log(`Robot stdout: ${output}`);
                    const deviceIdMatch = output.match(/🔹 DEVICE_UDID configurado como:\s*([^\s]+)/);
                    if (deviceIdMatch && deviceIdMatch[1]) {
                        detectedDeviceId = deviceIdMatch[1];
                        this.logger.log(`✅ Device ID detectado durante ejecución: ${detectedDeviceId}`);
                    }
                    const saldoInicialMatch = output.match(/💰 SALDO INICIAL OBTENIDO:\s*([\d.]+)/);
                    if (saldoInicialMatch && saldoInicialMatch[1]) {
                        saldoInicial = saldoInicialMatch[1];
                        this.logger.log(`✅ Saldo Inicial detectado durante ejecución: ${saldoInicial}`);
                    }
                    const saldoFinalMatch = output.match(/💰 SALDO FINAL OBTENIDO:\s*([\d.]+)/);
                    if (saldoFinalMatch && saldoFinalMatch[1]) {
                        saldoFinal = saldoFinalMatch[1];
                        this.logger.log(`✅ Saldo Final detectado durante ejecución: ${saldoFinal}`);
                    }
                    const modelMatch = output.match(/🔹 Modelo:\s*([^\n]+)/);
                    const brandMatch = output.match(/🔹 Marca:\s*([^\n]+)/);
                    const androidMatch = output.match(/🔹 Android:\s*([^\n]+)/);
                    if (modelMatch)
                        deviceInfo['model'] = modelMatch[1].trim();
                    if (brandMatch)
                        deviceInfo['brand'] = brandMatch[1].trim();
                    if (androidMatch)
                        deviceInfo['androidVersion'] = androidMatch[1].trim();
                });
                robotProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                    this.logger.error(`Robot stderr: ${data.toString()}`);
                });
                robotProcess.on('close', (code) => {
                    this.logger.log(`Robot process exited with code: ${code}`);
                    if (!detectedDeviceId) {
                        const deviceIdMatch = stdout.match(/🔹 DEVICE_UDID configurado como:\s*([^\s]+)/);
                        if (deviceIdMatch && deviceIdMatch[1]) {
                            detectedDeviceId = deviceIdMatch[1];
                            this.logger.log(`Device ID extraído del log completo: ${detectedDeviceId}`);
                        }
                    }
                    if (!saldoInicial) {
                        const saldoInicialMatch = stdout.match(/💰 SALDO INICIAL OBTENIDO:\s*([\d.]+)/);
                        if (saldoInicialMatch && saldoInicialMatch[1]) {
                            saldoInicial = saldoInicialMatch[1];
                            this.logger.log(`Saldo Inicial extraído del log completo: ${saldoInicial}`);
                        }
                    }
                    if (!saldoFinal) {
                        const saldoFinalMatch = stdout.match(/💰 SALDO FINAL OBTENIDO:\s*([\d.]+)/);
                        if (saldoFinalMatch && saldoFinalMatch[1]) {
                            saldoFinal = saldoFinalMatch[1];
                            this.logger.log(`Saldo Final extraído del log completo: ${saldoFinal}`);
                        }
                    }
                    const result = {
                        success: code === 0,
                        exitCode: code,
                        stdout: stdout,
                        stderr: stderr,
                        variables: variables,
                        deviceId: detectedDeviceId,
                        deviceInfo: Object.keys(deviceInfo).length > 0 ? deviceInfo : null,
                        saldoInicial: saldoInicial,
                        saldoFinal: saldoFinal,
                        scriptName: 'transfer.robot',
                        timestamp: new Date(),
                        message: code === 0 ? 'Transfer.robot ejecutado exitosamente' : 'Transfer.robot falló en la ejecución'
                    };
                    this.logAutomationProcess({
                        deviceId: detectedDeviceId || 'transfer_robot',
                        action: 'execute_transfer_robot',
                        result: result,
                        success: code === 0,
                        cliente: null,
                        user: null,
                    }).catch(err => this.logger.error('Error logging automation process:', err));
                    resolve(result);
                });
                robotProcess.on('error', (error) => {
                    this.logger.error(`Error ejecutando Robot Framework: ${error.message}`);
                    reject(new Error(`Error ejecutando Robot Framework: ${error.message}`));
                });
            });
        }
        catch (error) {
            this.logger.error(`Error en executeTransferRobot: ${error.message}`);
            throw new Error(`Error ejecutando transfer.robot: ${error.message}`);
        }
    }
};
exports.AutomationService = AutomationService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationService.prototype, "hourlyDeviceCheck", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationService.prototype, "dailyReportGeneration", null);
__decorate([
    (0, schedule_1.Cron)('0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationService.prototype, "monthlyMaintenance", null);
exports.AutomationService = AutomationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(automation_log_entity_1.AutomationLog)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(2, (0, typeorm_1.InjectRepository)(prestamo_entity_1.Prestamo)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, python_executor_service_1.PythonExecutorService])
], AutomationService);
//# sourceMappingURL=automation.service.js.map