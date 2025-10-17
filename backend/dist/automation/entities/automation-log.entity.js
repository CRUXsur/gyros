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
exports.AutomationLog = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("../../clientes/entities/cliente.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let AutomationLog = class AutomationLog {
    id;
    deviceId;
    action;
    result;
    timestamp;
    success;
    notes;
    cliente;
    user;
};
exports.AutomationLog = AutomationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AutomationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], AutomationLog.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], AutomationLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], AutomationLog.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AutomationLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { default: false }),
    __metadata("design:type", Boolean)
], AutomationLog.prototype, "success", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AutomationLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", cliente_entity_1.Cliente)
], AutomationLog.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], AutomationLog.prototype, "user", void 0);
exports.AutomationLog = AutomationLog = __decorate([
    (0, typeorm_1.Entity)('automation_logs')
], AutomationLog);
//# sourceMappingURL=automation-log.entity.js.map