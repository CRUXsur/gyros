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
exports.Pago = void 0;
const typeorm_1 = require("typeorm");
const prestamo_entity_1 = require("../../prestamos/entities/prestamo.entity");
const cuota_entity_1 = require("../../cuotas/entities/cuota.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let Pago = class Pago {
    id_pago;
    cuota;
    prestamo;
    monto_pago;
    fecha_pago;
    metodo_pago;
    numero_comprobante;
    observaciones;
    isActive;
    user;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pago.prototype, "id_pago", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuota_entity_1.Cuota, { eager: true }),
    __metadata("design:type", cuota_entity_1.Cuota)
], Pago.prototype, "cuota", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prestamo_entity_1.Prestamo, { eager: true }),
    __metadata("design:type", prestamo_entity_1.Prestamo)
], Pago.prototype, "prestamo", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Pago.prototype, "monto_pago", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Pago.prototype, "fecha_pago", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        default: 'efectivo'
    }),
    __metadata("design:type", String)
], Pago.prototype, "metodo_pago", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Pago.prototype, "numero_comprobante", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], Pago.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], Pago.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Pago.prototype, "user", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)()
], Pago);
//# sourceMappingURL=pago.entity.js.map