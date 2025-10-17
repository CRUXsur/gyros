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
exports.Cliente = void 0;
const typeorm_1 = require("typeorm");
const banco_cliente_entity_1 = require("../../banco-cliente/entities/banco-cliente.entity");
let Cliente = class Cliente {
    id_cliente;
    nombrecompleto;
    ci;
    celular;
    fijo;
    isActive;
    device_id;
    fecha_vto_tarjeta;
    sector;
    codigo;
    banco;
    numero_cuenta;
    moneda;
    garante;
    celular_garante;
    observaciones;
    fecha_registro;
    bancos;
    checkFieldsBeforeInsert() {
        this.ci = this.ci.toString().trim();
        if (!this.fecha_registro) {
            this.fecha_registro = new Date();
        }
    }
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cliente.prototype, "id_cliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cliente.prototype, "nombrecompleto", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
    }),
    __metadata("design:type", String)
], Cliente.prototype, "ci", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "celular", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "fijo", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], Cliente.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)('date', {
        nullable: true
    }),
    __metadata("design:type", Date)
], Cliente.prototype, "fecha_vto_tarjeta", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        default: 'no_especificado'
    }),
    __metadata("design:type", String)
], Cliente.prototype, "banco", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
        default: 'no_especificado'
    }),
    __metadata("design:type", String)
], Cliente.prototype, "numero_cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        default: 'Bolivianos'
    }),
    __metadata("design:type", String)
], Cliente.prototype, "moneda", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "garante", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "celular_garante", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cliente.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)('date', {
        nullable: true
    }),
    __metadata("design:type", Date)
], Cliente.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => banco_cliente_entity_1.BancoCliente, (bancoCliente) => bancoCliente.cliente, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], Cliente.prototype, "bancos", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cliente.prototype, "checkFieldsBeforeInsert", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cliente.prototype, "checkFieldsBeforeUpdate", null);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)()
], Cliente);
//# sourceMappingURL=cliente.entity.js.map