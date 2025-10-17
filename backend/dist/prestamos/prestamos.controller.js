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
exports.PrestamosController = void 0;
const common_1 = require("@nestjs/common");
const prestamos_service_1 = require("./prestamos.service");
const create_prestamo_dto_1 = require("./dto/create-prestamo.dto");
const update_prestamo_dto_1 = require("./dto/update-prestamo.dto");
const pagination_dto_1 = require("./../common/dtos/pagination.dto");
const decorators_1 = require("../auth/decorators");
const interfaces_1 = require("../auth/interfaces");
const user_entity_1 = require("../auth/entities/user.entity");
let PrestamosController = class PrestamosController {
    prestamosService;
    constructor(prestamosService) {
        this.prestamosService = prestamosService;
    }
    create(createPrestamoDto, user) {
        return this.prestamosService.create(createPrestamoDto, user);
    }
    findAll(paginationDto) {
        return this.prestamosService.findAll(paginationDto);
    }
    findOne(id_prestamo) {
        return this.prestamosService.findOnePlain(id_prestamo);
    }
    update(id_prestamo, updatePrestamoDto, user) {
        return this.prestamosService.update(id_prestamo, updatePrestamoDto, user);
    }
    remove(id_prestamo) {
        return this.prestamosService.remove(id_prestamo);
    }
};
exports.PrestamosController = PrestamosController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prestamo_dto_1.CreatePrestamoDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PrestamosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Auth)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PrestamosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id_prestamo'),
    __param(0, (0, common_1.Param)('id_prestamo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrestamosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id_prestamo'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_prestamo', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_prestamo_dto_1.UpdatePrestamoDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PrestamosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id_prestamo'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_prestamo', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrestamosController.prototype, "remove", null);
exports.PrestamosController = PrestamosController = __decorate([
    (0, common_1.Controller)('prestamos'),
    __metadata("design:paramtypes", [prestamos_service_1.PrestamosService])
], PrestamosController);
//# sourceMappingURL=prestamos.controller.js.map