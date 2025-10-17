"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const prestamos_module_1 = require("./prestamos/prestamos.module");
const common_module_1 = require("./common/common.module");
const seed_module_1 = require("./seed/seed.module");
const auth_module_1 = require("./auth/auth.module");
const clientes_module_1 = require("./clientes/clientes.module");
const cuotas_module_1 = require("./cuotas/cuotas.module");
const pagos_module_1 = require("./pagos/pagos.module");
const automation_module_1 = require("./automation/automation.module");
const bancos_module_1 = require("./bancos/bancos.module");
const banco_cliente_module_1 = require("./banco-cliente/banco-cliente.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                ssl: process.env.STAGE === 'prod',
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                database: process.env.DB_NAME || 'gyros_db',
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                autoLoadEntities: true,
                synchronize: true,
            }),
            prestamos_module_1.PrestamosModule,
            common_module_1.CommonModule,
            seed_module_1.SeedModule,
            auth_module_1.AuthModule,
            clientes_module_1.ClientesModule,
            cuotas_module_1.CuotasModule,
            pagos_module_1.PagosModule,
            automation_module_1.AutomationModule,
            bancos_module_1.BancosModule,
            banco_cliente_module_1.BancoClienteModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map