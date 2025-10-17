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
exports.Cuota = void 0;
const typeorm_1 = require("typeorm");
const prestamo_entity_1 = require("../../prestamos/entities/prestamo.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let Cuota = class Cuota {
    id_cuota;
    prestamo;
    numero_cuota;
    monto_cuota;
    monto_pagado;
    fecha_vencimiento;
    fecha_pago;
    estado;
    observaciones;
    isActive;
    user;
};
exports.Cuota = Cuota;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cuota.prototype, "id_cuota", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prestamo_entity_1.Prestamo, { eager: true }),
    __metadata("design:type", prestamo_entity_1.Prestamo)
], Cuota.prototype, "prestamo", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Cuota.prototype, "numero_cuota", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Cuota.prototype, "monto_cuota", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0
    }),
    __metadata("design:type", Number)
], Cuota.prototype, "monto_pagado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Cuota.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", Date)
], Cuota.prototype, "fecha_pago", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        default: 'pendiente'
    }),
    __metadata("design:type", String)
], Cuota.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Cuota.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], Cuota.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Cuota.prototype, "user", void 0);
exports.Cuota = Cuota = __decorate([
    (0, typeorm_1.Entity)()
], Cuota);
//# sourceMappingURL=cuota.entity.js.map