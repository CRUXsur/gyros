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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationController = void 0;
const common_1 = require("@nestjs/common");
const automation_service_1 = require("./automation.service");
const python_executor_service_1 = require("./python-executor.service");
const automation_action_dto_1 = require("./dto/automation-action.dto");
const decorators_1 = require("../auth/decorators");
const interfaces_1 = require("../auth/interfaces");
const user_entity_1 = require("../auth/entities/user.entity");
let AutomationController = class AutomationController {
    automationService;
    pythonExecutorService;
    logger = new common_1.Logger('AutomationController');
    constructor(automationService, pythonExecutorService) {
        this.automationService = automationService;
        this.pythonExecutorService = pythonExecutorService;
    }
    async checkDeviceId() {
        try {
            const deviceId = await this.pythonExecutorService.executeDeviceDetection();
            const result = await this.automationService.validateClienteDevice(deviceId);
            return {
                success: true,
                deviceId,
                cliente: result.cliente,
                hasActiveLoans: result.hasActiveLoans,
                activeLoans: result.activeLoans,
                message: result.message,
            };
        }
        catch (error) {
            return {
                success: false,
                reason: error.message,
                deviceId: null,
            };
        }
    }
    async startAutomationProcess(automationActionDto, user) {
        try {
            const result = await this.automationService.orchestrateDeviceProcess(automationActionDto, user);
            return {
                success: true,
                result,
                message: 'Proceso de automatización completado exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error en el proceso de automatización',
            };
        }
    }
    async getAutomationStatus() {
        return await this.automationService.getCurrentStatus();
    }
    async getProcessHistory(limit) {
        return await this.automationService.getProcessHistory(limit || 10);
    }
    async validateSpecificDevice(deviceId) {
        try {
            const isValid = await this.pythonExecutorService.checkDeviceConnection(deviceId);
            return {
                success: true,
                deviceId,
                isValid,
                message: isValid ? 'Dispositivo válido' : 'Dispositivo no válido',
            };
        }
        catch (error) {
            return {
                success: false,
                deviceId,
                isValid: false,
                error: error.message,
            };
        }
    }
    async triggerScheduledCheck() {
        try {
            const result = await this.automationService.triggerScheduledCheck();
            return {
                success: true,
                message: 'Verificación programada ejecutada manualmente',
                result,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error ejecutando verificación programada',
            };
        }
    }
    async getDailyStats() {
        try {
            const stats = await this.automationService.getDailyStatistics();
            return {
                success: true,
                stats,
                message: 'Estadísticas diarias obtenidas exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error obteniendo estadísticas diarias',
            };
        }
    }
    async getDeviceStats() {
        try {
            const stats = await this.automationService.getDeviceStatistics();
            return {
                success: true,
                stats,
                message: 'Estadísticas de dispositivos obtenidas exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error obteniendo estadísticas de dispositivos',
            };
        }
    }
    async getPerformanceStats() {
        try {
            const stats = await this.automationService.getPerformanceStatistics();
            return {
                success: true,
                stats,
                message: 'Estadísticas de rendimiento obtenidas exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error obteniendo estadísticas de rendimiento',
            };
        }
    }
    async getHealthCheck() {
        try {
            const health = await this.automationService.getSystemHealth();
            return {
                success: true,
                health,
                timestamp: new Date(),
                message: 'Sistema operacional',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error en verificación de salud del sistema',
            };
        }
    }
    async executeRobotScript(user) {
        try {
            const result = await this.automationService.executeRobotScript('Add_Note_Test.robot');
            return {
                success: true,
                result,
                message: 'Script de Robot Framework ejecutado exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error ejecutando script de Robot Framework',
            };
        }
    }
    async executeTransferRobot(variables) {
        try {
            this.logger.log('Ejecutando transfer.robot con variables del formulario');
            const result = await this.automationService.executeTransferRobot(variables);
            return {
                success: result.success,
                deviceId: result.deviceId,
                deviceInfo: result.deviceInfo,
                saldoInicial: result.saldoInicial,
                saldoFinal: result.saldoFinal,
                result: result,
                message: result.message || 'Transfer robot ejecutado exitosamente',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error ejecutando transfer robot',
            };
        }
    }
};
exports.AutomationController = AutomationController;
__decorate([
    (0, common_1.Get)('check-device-id'),
    (0, decorators_1.Auth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "checkDeviceId", null);
__decorate([
    (0, common_1.Post)('start-process'),
    (0, decorators_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [automation_action_dto_1.AutomationActionDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "startAutomationProcess", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, decorators_1.Auth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getAutomationStatus", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getProcessHistory", null);
__decorate([
    (0, common_1.Get)('validate-device/:deviceId'),
    (0, decorators_1.Auth)(),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "validateSpecificDevice", null);
__decorate([
    (0, common_1.Post)('trigger-scheduled-check'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "triggerScheduledCheck", null);
__decorate([
    (0, common_1.Get)('stats/daily'),
    (0, decorators_1.Auth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getDailyStats", null);
__decorate([
    (0, common_1.Get)('stats/devices'),
    (0, decorators_1.Auth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getDeviceStats", null);
__decorate([
    (0, common_1.Get)('stats/performance'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getPerformanceStats", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "getHealthCheck", null);
__decorate([
    (0, common_1.Post)('execute-robot-script'),
    (0, decorators_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "executeRobotScript", null);
__decorate([
    (0, common_1.Post)('execute-transfer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "executeTransferRobot", null);
exports.AutomationController = AutomationController = __decorate([
    (0, common_1.Controller)('automation'),
    __metadata("design:paramtypes", [automation_service_1.AutomationService,
        python_executor_service_1.PythonExecutorService])
], AutomationController);
//# sourceMappingURL=automation.controller.js.map