"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const automation_controller_1 = require("./automation.controller");
const automation_service_1 = require("./automation.service");
const python_executor_service_1 = require("./python-executor.service");
const automation_log_entity_1 = require("./entities/automation-log.entity");
const clientes_module_1 = require("../clientes/clientes.module");
const prestamos_module_1 = require("../prestamos/prestamos.module");
const auth_module_1 = require("../auth/auth.module");
let AutomationModule = class AutomationModule {
};
exports.AutomationModule = AutomationModule;
exports.AutomationModule = AutomationModule = __decorate([
    (0, common_1.Module)({
        controllers: [automation_controller_1.AutomationController],
        providers: [automation_service_1.AutomationService, python_executor_service_1.PythonExecutorService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([automation_log_entity_1.AutomationLog]),
            clientes_module_1.ClientesModule,
            prestamos_module_1.PrestamosModule,
            auth_module_1.AuthModule,
        ],
        exports: [automation_service_1.AutomationService, python_executor_service_1.PythonExecutorService],
    })
], AutomationModule);
//# sourceMappingURL=automation.module.js.map