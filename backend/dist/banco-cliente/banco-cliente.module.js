"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancoClienteModule = void 0;
const common_1 = require("@nestjs/common");
const banco_cliente_service_1 = require("./banco-cliente.service");
const banco_cliente_controller_1 = require("./banco-cliente.controller");
const typeorm_1 = require("@nestjs/typeorm");
const banco_cliente_entity_1 = require("./entities/banco-cliente.entity");
const cliente_entity_1 = require("../clientes/entities/cliente.entity");
const auth_module_1 = require("../auth/auth.module");
let BancoClienteModule = class BancoClienteModule {
};
exports.BancoClienteModule = BancoClienteModule;
exports.BancoClienteModule = BancoClienteModule = __decorate([
    (0, common_1.Module)({
        controllers: [banco_cliente_controller_1.BancoClienteController],
        providers: [banco_cliente_service_1.BancoClienteService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([banco_cliente_entity_1.BancoCliente, cliente_entity_1.Cliente]),
            auth_module_1.AuthModule,
        ],
        exports: [banco_cliente_service_1.BancoClienteService, typeorm_1.TypeOrmModule],
    })
], BancoClienteModule);
//# sourceMappingURL=banco-cliente.module.js.map