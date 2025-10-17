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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancosController = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("./bancos.service");
const create_banco_dto_1 = require("./dto/create-banco.dto");
const update_banco_dto_1 = require("./dto/update-banco.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const valid_roles_1 = require("../auth/interfaces/valid-roles");
let BancosController = class BancosController {
    bancosService;
    constructor(bancosService) {
        this.bancosService = bancosService;
    }
    create(createBancoDto) {
        return this.bancosService.create(createBancoDto);
    }
    findAll() {
        return this.bancosService.findAll();
    }
    findOne(id) {
        return this.bancosService.findOne(id);
    }
    update(id, updateBancoDto) {
        return this.bancosService.update(id, updateBancoDto);
    }
    remove(id) {
        return this.bancosService.remove(id);
    }
};
exports.BancosController = BancosController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(valid_roles_1.ValidRoles.admin, valid_roles_1.ValidRoles.superUser, valid_roles_1.ValidRoles.superAdmin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banco_dto_1.CreateBancoDto]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(valid_roles_1.ValidRoles.admin, valid_roles_1.ValidRoles.user, valid_roles_1.ValidRoles.superUser, valid_roles_1.ValidRoles.superAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(valid_roles_1.ValidRoles.admin, valid_roles_1.ValidRoles.user, valid_roles_1.ValidRoles.superUser, valid_roles_1.ValidRoles.superAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(valid_roles_1.ValidRoles.admin, valid_roles_1.ValidRoles.superUser, valid_roles_1.ValidRoles.superAdmin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_banco_dto_1.UpdateBancoDto]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(valid_roles_1.ValidRoles.admin, valid_roles_1.ValidRoles.superUser, valid_roles_1.ValidRoles.superAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "remove", null);
exports.BancosController = BancosController = __decorate([
    (0, common_1.Controller)('bancos'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], BancosController);
//# sourceMappingURL=bancos.controller.js.map