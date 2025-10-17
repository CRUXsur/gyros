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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuotasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cuota_entity_1 = require("./entities/cuota.entity");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const uuid_1 = require("uuid");
let CuotasService = class CuotasService {
    cuotaRepository;
    prestamoRepository;
    logger = new common_1.Logger('CuotasService');
    constructor(cuotaRepository, prestamoRepository) {
        this.cuotaRepository = cuotaRepository;
        this.prestamoRepository = prestamoRepository;
    }
    async create(createCuotaDto, user) {
        try {
            const { id_prestamo, ...cuotaDetails } = createCuotaDto;
            const prestamo = await this.prestamoRepository.findOneBy({ id_prestamo });
            if (!prestamo) {
                throw new common_1.NotFoundException(`Préstamo con id ${id_prestamo} no encontrado`);
            }
            const existingCuota = await this.cuotaRepository.findOne({
                where: {
                    prestamo: { id_prestamo },
                    numero_cuota: createCuotaDto.numero_cuota
                }
            });
            if (existingCuota) {
                throw new common_1.BadRequestException(`Ya existe una cuota número ${createCuotaDto.numero_cuota} para este préstamo`);
            }
            const cuota = this.cuotaRepository.create({
                ...cuotaDetails,
                prestamo,
                user,
            });
            await this.cuotaRepository.save(cuota);
            return cuota;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async findAll(paginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        return await this.cuotaRepository.find({
            take: limit,
            skip: offset,
            relations: {
                prestamo: true,
                user: true,
            },
            order: {
                fecha_vencimiento: 'ASC',
                numero_cuota: 'ASC'
            }
        });
    }
    async findOne(id_cuota) {
        if (!(0, uuid_1.validate)(id_cuota)) {
            throw new common_1.BadRequestException('El ID debe ser un UUID válido');
        }
        const cuota = await this.cuotaRepository.findOne({
            where: { id_cuota },
            relations: {
                prestamo: true,
                user: true,
            }
        });
        if (!cuota) {
            throw new common_1.NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
        }
        return cuota;
    }
    async findByPrestamo(id_prestamo) {
        if (!(0, uuid_1.validate)(id_prestamo)) {
            throw new common_1.BadRequestException('El ID del préstamo debe ser un UUID válido');
        }
        return await this.cuotaRepository.find({
            where: {
                prestamo: { id_prestamo }
            },
            relations: {
                prestamo: true,
                user: true,
            },
            order: {
                numero_cuota: 'ASC'
            }
        });
    }
    async update(id_cuota, updateCuotaDto, user) {
        try {
            const cuota = await this.findOne(id_cuota);
            const cuotaToUpdate = await this.cuotaRepository.preload({
                id_cuota: cuota.id_cuota,
                ...updateCuotaDto,
                user,
            });
            if (!cuotaToUpdate) {
                throw new common_1.NotFoundException(`Cuota con id ${id_cuota} no encontrada`);
            }
            await this.cuotaRepository.save(cuotaToUpdate);
            return this.findOne(id_cuota);
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async remove(id_cuota) {
        const cuota = await this.findOne(id_cuota);
        await this.cuotaRepository.remove(cuota);
        return { message: `Cuota ${id_cuota} eliminada correctamente` };
    }
    handleDBExceptions(error) {
        if (error.code === '23505') {
            throw new common_1.BadRequestException(error.detail);
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisar logs del servidor');
    }
};
exports.CuotasService = CuotasService;
exports.CuotasService = CuotasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cuota_entity_1.Cuota)),
    __param(1, (0, typeorm_1.InjectRepository)(prestamo_entity_1.Prestamo)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], CuotasService);
//# sourceMappingURL=cuotas.service.js.map