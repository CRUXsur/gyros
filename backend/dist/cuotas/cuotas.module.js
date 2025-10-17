"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuotasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cuotas_service_1 = require("./cuotas.service");
const cuotas_controller_1 = require("./cuotas.controller");
const cuota_entity_1 = require("./entities/cuota.entity");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const auth_module_1 = require("../auth/auth.module");
let CuotasModule = class CuotasModule {
};
exports.CuotasModule = CuotasModule;
exports.CuotasModule = CuotasModule = __decorate([
    (0, common_1.Module)({
        controllers: [cuotas_controller_1.CuotasController],
        providers: [cuotas_service_1.CuotasService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cuota_entity_1.Cuota, prestamo_entity_1.Prestamo]),
            auth_module_1.AuthModule
        ],
        exports: [
            typeorm_1.TypeOrmModule,
            cuotas_service_1.CuotasService
        ]
    })
], CuotasModule);
//# sourceMappingURL=cuotas.module.js.map