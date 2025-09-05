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
let Prestamo = class Prestamo {
    id;
    monto;
    nocuotas;
    capital;
    interes;
    saldo;
    images;
    user;
};
exports.Prestamo = Prestamo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Prestamo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0,
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        default: 0
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "nocuotas", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0,
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "capital", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0,
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "interes", void 0);
__decorate([
    (0, typeorm_1.Column)('float', {
        default: 0,
    }),
    __metadata("design:type", Number)
], Prestamo.prototype, "saldo", void 0);
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