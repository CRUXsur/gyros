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
let Cliente = class Cliente {
    id;
    nombres;
    ci;
    telefono;
    device_id;
    email;
    sexo;
    estado_civil;
    isActive;
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
        this.ci = this.ci.toString().trim();
    }
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cliente.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
    }),
    __metadata("design:type", String)
], Cliente.prototype, "ci", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        unique: true,
    }),
    __metadata("design:type", String)
], Cliente.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cliente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        array: true,
        default: ['mujer', 'hombre']
    }),
    __metadata("design:type", Array)
], Cliente.prototype, "sexo", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        array: true,
        default: ['soltero', 'casado', 'divorciado', 'viudo']
    }),
    __metadata("design:type", Array)
], Cliente.prototype, "estado_civil", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], Cliente.prototype, "isActive", void 0);
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