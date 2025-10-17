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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pago_entity_1 = require("./entities/pago.entity");
const cuota_entity_1 = require("../cuotas/entities/cuota.entity");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const uuid_1 = require("uuid");
let PagosService = class PagosService {
    pagoRepository;
    cuotaRepository;
    prestamoRepository;
    dataSource;
    logger = new common_1.Logger('PagosService');
    constructor(pagoRepository, cuotaRepository, prestamoRepository, dataSource) {
        this.pagoRepository = pagoRepository;
        this.cuotaRepository = cuotaRepository;
        this.prestamoRepository = prestamoRepository;
        this.dataSource = dataSource;
    }
    async create(createPagoDto, user) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { id_cuota, id_prestamo, monto_pago, ...pagoDetails } = createPagoDto;
            const cuota = await this.cuotaRepository.findOneBy({ id_cuota });
            if (!cuota) {
                throw new common_1.NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
            }
            const prestamo = await this.prestamoRepository.findOneBy({ id_prestamo });
            if (!prestamo) {
                throw new common_1.NotFoundException(`Préstamo con id ${id_prestamo} no encontrado`);
            }
            if (cuota.prestamo.id_prestamo !== id_prestamo) {
                throw new common_1.BadRequestException('La cuota no pertenece al préstamo especificado');
            }
            const montoPendiente = cuota.monto_cuota - cuota.monto_pagado;
            if (monto_pago > montoPendiente) {
                throw new common_1.BadRequestException(`El monto del pago ($${monto_pago}) no puede ser mayor al monto pendiente ($${montoPendiente})`);
            }
            const pago = this.pagoRepository.create({
                ...pagoDetails,
                monto_pago,
                cuota,
                prestamo,
                user,
            });
            await queryRunner.manager.save(pago);
            const nuevoMontoPagado = cuota.monto_pagado + monto_pago;
            const nuevoEstado = nuevoMontoPagado >= cuota.monto_cuota ? 'pagado' : 'pendiente';
            const updateData = {
                monto_pagado: nuevoMontoPagado,
                estado: nuevoEstado
            };
            if (nuevoEstado === 'pagado') {
                updateData.fecha_pago = createPagoDto.fecha_pago;
            }
            await queryRunner.manager.update(cuota_entity_1.Cuota, { id_cuota }, updateData);
            await queryRunner.commitTransaction();
            return await this.findOne(pago.id_pago);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.handleDBExceptions(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(paginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        return await this.pagoRepository.find({
            take: limit,
            skip: offset,
            relations: {
                cuota: true,
                prestamo: true,
                user: true,
            },
            order: {
                fecha_pago: 'DESC'
            }
        });
    }
    async findOne(id_pago) {
        if (!(0, uuid_1.validate)(id_pago)) {
            throw new common_1.BadRequestException('El ID debe ser un UUID válido');
        }
        const pago = await this.pagoRepository.findOne({
            where: { id_pago },
            relations: {
                cuota: true,
                prestamo: true,
                user: true,
            }
        });
        if (!pago) {
            throw new common_1.NotFoundException(`Pago con id ${id_pago} no encontrado`);
        }
        return pago;
    }
    async findByPrestamo(id_prestamo) {
        if (!(0, uuid_1.validate)(id_prestamo)) {
            throw new common_1.BadRequestException('El ID del préstamo debe ser un UUID válido');
        }
        return await this.pagoRepository.find({
            where: {
                prestamo: { id_prestamo }
            },
            relations: {
                cuota: true,
                prestamo: true,
                user: true,
            },
            order: {
                fecha_pago: 'DESC'
            }
        });
    }
    async findByCuota(id_cuota) {
        if (!(0, uuid_1.validate)(id_cuota)) {
            throw new common_1.BadRequestException('El ID de la cuota debe ser un UUID válido');
        }
        return await this.pagoRepository.find({
            where: {
                cuota: { id_cuota }
            },
            relations: {
                cuota: true,
                prestamo: true,
                user: true,
            },
            order: {
                fecha_pago: 'DESC'
            }
        });
    }
    async update(id_pago, updatePagoDto, user) {
        try {
            const pago = await this.findOne(id_pago);
            const pagoToUpdate = await this.pagoRepository.preload({
                id_pago: pago.id_pago,
                ...updatePagoDto,
                user,
            });
            if (!pagoToUpdate) {
                throw new common_1.NotFoundException(`Pago con id ${id_pago} no encontrado`);
            }
            await this.pagoRepository.save(pagoToUpdate);
            return this.findOne(id_pago);
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async remove(id_pago) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const pago = await this.findOne(id_pago);
            const cuota = pago.cuota;
            const nuevoMontoPagado = cuota.monto_pagado - pago.monto_pago;
            const nuevoEstado = nuevoMontoPagado >= cuota.monto_cuota ? 'pagado' : 'pendiente';
            const updateData = {
                monto_pagado: nuevoMontoPagado,
                estado: nuevoEstado
            };
            if (nuevoEstado === 'pagado') {
                updateData.fecha_pago = cuota.fecha_pago;
            }
            else {
                updateData.fecha_pago = null;
            }
            await queryRunner.manager.update(cuota_entity_1.Cuota, { id_cuota: cuota.id_cuota }, updateData);
            await queryRunner.manager.remove(pago);
            await queryRunner.commitTransaction();
            return { message: `Pago ${id_pago} eliminado correctamente` };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.handleDBExceptions(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    handleDBExceptions(error) {
        if (error.code === '23505') {
            throw new common_1.BadRequestException(error.detail);
        }
        if (error instanceof common_1.BadRequestException ||
            error instanceof common_1.NotFoundException) {
            throw error;
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar logs del servidor');
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(cuota_entity_1.Cuota)),
    __param(2, (0, typeorm_1.InjectRepository)(prestamo_entity_1.Prestamo)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _d : Object])
], PagosService);
//# sourceMappingURL=pagos.service.js.map