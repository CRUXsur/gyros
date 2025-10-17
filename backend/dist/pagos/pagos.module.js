"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pagos_service_1 = require("./pagos.service");
const pagos_controller_1 = require("./pagos.controller");
const pago_entity_1 = require("./entities/pago.entity");
const cuota_entity_1 = require("../cuotas/entities/cuota.entity");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const auth_module_1 = require("../auth/auth.module");
let PagosModule = class PagosModule {
};
exports.PagosModule = PagosModule;
exports.PagosModule = PagosModule = __decorate([
    (0, common_1.Module)({
        controllers: [pagos_controller_1.PagosController],
        providers: [pagos_service_1.PagosService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pago_entity_1.Pago, cuota_entity_1.Cuota, prestamo_entity_1.Prestamo]),
            auth_module_1.AuthModule
        ],
        exports: [
            typeorm_1.TypeOrmModule,
            pagos_service_1.PagosService
        ]
    })
], PagosModule);
//# sourceMappingURL=pagos.module.js.map