"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancosModule = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("./bancos.service");
const bancos_controller_1 = require("./bancos.controller");
const typeorm_1 = require("@nestjs/typeorm");
const banco_entity_1 = require("./entities/banco.entity");
const auth_module_1 = require("../auth/auth.module");
let BancosModule = class BancosModule {
};
exports.BancosModule = BancosModule;
exports.BancosModule = BancosModule = __decorate([
    (0, common_1.Module)({
        controllers: [bancos_controller_1.BancosController],
        providers: [bancos_service_1.BancosService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([banco_entity_1.Banco]),
            auth_module_1.AuthModule
        ],
        exports: [
            bancos_service_1.BancosService,
            typeorm_1.TypeOrmModule
        ]
    })
], BancosModule);
//# sourceMappingURL=bancos.module.js.map