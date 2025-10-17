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
exports.PagosController = void 0;
const common_1 = require("@nestjs/common");
const pagos_service_1 = require("./pagos.service");
const create_pago_dto_1 = require("./dto/create-pago.dto");
const update_pago_dto_1 = require("./dto/update-pago.dto");
const decorators_1 = require("../auth/decorators");
const interfaces_1 = require("../auth/interfaces");
const user_entity_1 = require("../auth/entities/user.entity");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let PagosController = class PagosController {
    pagosService;
    constructor(pagosService) {
        this.pagosService = pagosService;
    }
    create(createPagoDto, user) {
        return this.pagosService.create(createPagoDto, user);
    }
    findAll(paginationDto) {
        return this.pagosService.findAll(paginationDto);
    }
    findOne(id_pago) {
        return this.pagosService.findOne(id_pago);
    }
    findByPrestamo(id_prestamo) {
        return this.pagosService.findByPrestamo(id_prestamo);
    }
    findByCuota(id_cuota) {
        return this.pagosService.findByCuota(id_cuota);
    }
    update(id_pago, updatePagoDto, user) {
        return this.pagosService.update(id_pago, updatePagoDto, user);
    }
    remove(id_pago) {
        return this.pagosService.remove(id_pago);
    }
};
exports.PagosController = PagosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pago_dto_1.CreatePagoDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id_pago'),
    __param(0, (0, common_1.Param)('id_pago', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('prestamo/:id_prestamo'),
    __param(0, (0, common_1.Param)('id_prestamo', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "findByPrestamo", null);
__decorate([
    (0, common_1.Get)('cuota/:id_cuota'),
    __param(0, (0, common_1.Param)('id_cuota', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "findByCuota", null);
__decorate([
    (0, common_1.Patch)(':id_pago'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_pago', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pago_dto_1.UpdatePagoDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id_pago'),
    (0, decorators_1.Auth)(interfaces_1.ValidRoles.admin),
    __param(0, (0, common_1.Param)('id_pago', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagosController.prototype, "remove", null);
exports.PagosController = PagosController = __decorate([
    (0, common_1.Controller)('pagos'),
    (0, decorators_1.Auth)(),
    __metadata("design:paramtypes", [pagos_service_1.PagosService])
], PagosController);
//# sourceMappingURL=pagos.controller.js.map