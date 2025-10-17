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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancoCliente = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
let BancoCliente = class BancoCliente {
    id_banco_cliente;
    cliente;
    banco;
    noCta;
    nombre;
    moneda;
    usuario;
    key;
    isActive;
    created_at;
    updated_at;
};
exports.BancoCliente = BancoCliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BancoCliente.prototype, "id_banco_cliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, (cliente) => cliente.bancos, { onDelete: 'CASCADE' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], BancoCliente.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BancoCliente.prototype, "banco", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BancoCliente.prototype, "noCta", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BancoCliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], BancoCliente.prototype, "moneda", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], BancoCliente.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], BancoCliente.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], BancoCliente.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], BancoCliente.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], BancoCliente.prototype, "updated_at", void 0);
exports.BancoCliente = BancoCliente = __decorate([
    (0, typeorm_1.Entity)('banco_cliente')
], BancoCliente);
//# sourceMappingURL=banco-cliente.entity.js.map