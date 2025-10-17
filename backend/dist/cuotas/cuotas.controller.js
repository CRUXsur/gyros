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
exports.CuotasController = void 0;
const common_1 = require("@nestjs/common");
const cuotas_service_1 = require("./cuotas.service");
const create_cuota_dto_1 = require("./dto/create-cuota.dto");
const update_cuota_dto_1 = require("./dto/update-cuota.dto");
const decorators_1 = require("../auth/decorators");
const interfaces_1 = require("../auth/interfaces");
const user_entity_1 = require("../auth/entities/user.entity");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let CuotasController = class CuotasController {
    cuotasService;
    constructor(cuotasService) {
        this.cuotasService = cuotasService;
    }
    create(createCuotaDto, user) {
        return this.cuotasService.create(createCuotaDto, user);
    }
    findAll(paginationDto) {
        return this.cuotasService.findAll(paginationDto);
    }
    findOne(id_cuota) {
        return this.cuotasService.findOne(id_cuota);
    }
    findByPrestamo(id_prestamo) {
        return this.cuotasService.findByPrestamo(id_prestamo);
    }
    update(id_cuota, updateCuotaDto, user) {
        return this.cuotasService.update(id_cuota, updateCuotaDto, user);
    }
    remove(id_cuota) {
        return this.cuotasService.remove(id_cuota);
    }
};
exports.CuotasController = CuotasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cuota_dto_1.CreateCuotaDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id_cuota'),
    __param(0, (0, common_1.Param)('id_cuota', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('prestamo/:id_prestamo'),
    __param(0, (0, common_1.Param)('id_prestamo', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "findByPrestamo", null);
__decorate([
    (0, common_1.Patch)(':id_cuota'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_cuota', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cuota_dto_1.UpdateCuotaDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id_cuota'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_cuota', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CuotasController.prototype, "remove", null);
exports.CuotasController = CuotasController = __decorate([
    (0, common_1.Controller)('cuotas'),
    (0, decorators_1.Auth)(),
    __metadata("design:paramtypes", [cuotas_service_1.CuotasService])
], CuotasController);
//# sourceMappingURL=cuotas.controller.js.map