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
exports.Prestamo = void 0;
const typeorm_1 = require("typeorm");
const _1 = require("./");
const user_entity_1 = require("../../auth/entities/user.entity");
const cliente_entity_1 = require("src/clientes/entities/cliente.entity");
let Prestamo = class Prestamo {
    id_prestamo;
    cliente;
    monto_prestado;
    tasa_interes;
    plazo_meses;
    fecha_prestamo;
    fecha_vencimiento;
    isActive;
    images;
    user;
};
exports.Prestamo = Prestamo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Prestamo.prototype, "id_prestamo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { eager: true }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Prestamo.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "monto_prestado", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "tasa_interes", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        default: 0
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "plazo_meses", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Prestamo.prototype, "fecha_prestamo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Prestamo.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        default: true,
    }),
    __metadata("design:type", Boolean)
], Prestamo.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => _1.PrestamoImage, (prestamoImage) => prestamoImage.prestamo, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], Prestamo.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.prestamo, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Prestamo.prototype, "user", void 0);
exports.Prestamo = Prestamo = __decorate([
    (0, typeorm_1.Entity)()
], Prestamo);
//# sourceMappingURL=prestamo.entity.js.map