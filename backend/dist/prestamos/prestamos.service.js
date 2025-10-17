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
exports.PrestamosService = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const cliente_entity_1 = require("../clientes/entities/cliente.entity");
let PrestamosService = class PrestamosService {
    prestamoRepository;
    prestamoImageRepository;
    clienteRepository;
    dataSource;
    logger = new common_1.Logger('');
    constructor(prestamoRepository, prestamoImageRepository, clienteRepository, dataSource) {
        this.prestamoRepository = prestamoRepository;
        this.prestamoImageRepository = prestamoImageRepository;
        this.clienteRepository = clienteRepository;
        this.dataSource = dataSource;
    }
    async create(createPrestamoDto, user) {
        try {
            const { images = [], id_cliente, ...prestamoDetails } = createPrestamoDto;
            const cliente = await this.clienteRepository.findOneBy({ id_cliente });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con id ${id_cliente} no encontrado`);
            }
            const prestamo = this.prestamoRepository.create({
                ...prestamoDetails,
                cliente,
                images: images.map(image => this.prestamoImageRepository.create({ url: image })),
                user,
            });
            await this.prestamoRepository.save(prestamo);
            return { ...prestamo, images: images };
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async findAll(paginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        const prestamos = await this.prestamoRepository.find({
            take: limit,
            skip: offset,
            relations: {
                images: true,
                cliente: true,
                user: true,
            }
        });
        return prestamos.map(prestamo => ({
            ...prestamo,
            images: prestamo.images?.map(img => img.url),
        }));
    }
    async findOne(term) {
        let prestamo;
        if ((0, uuid_1.validate)(term)) {
            prestamo = await this.prestamoRepository.findOne({
                where: { id_prestamo: term },
                relations: {
                    images: true,
                    cliente: true,
                    user: true,
                }
            });
        }
        else {
            throw new common_1.BadRequestException('El término de búsqueda debe ser un UUID válido');
        }
        if (!prestamo)
            throw new common_1.NotFoundException(`Prestamo con id ${term} no encontrado`);
        return prestamo;
    }
    async findOnePlain(term) {
        const { images = [], ...rest } = await this.findOne(term);
        return {
            ...rest,
            images: images.map(image => image.url),
        };
    }
    async update(id_prestamo, updatePrestamoDto, user) {
        const { images, ...toUpdate } = updatePrestamoDto;
        const prestamo = await this.prestamoRepository.preload({
            id_prestamo, ...toUpdate,
        });
        if (!prestamo)
            throw new common_1.NotFoundException(`Prestamo con id ${id_prestamo} no encontrado`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (images) {
                await queryRunner.manager.delete(entities_1.PrestamoImage, { prestamo: { id_prestamo } });
                prestamo.images = images.map(image => this.prestamoImageRepository.create({ url: image }));
            }
            else {
                prestamo.images = await this.prestamoImageRepository.findBy({ prestamo: { id_prestamo } });
            }
            prestamo.user = user;
            await queryRunner.manager.save(prestamo);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return this.findOnePlain(id_prestamo);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            this.handleDBExceptions(error);
        }
    }
    async remove(id_prestamo) {
        const prestamo = await this.findOne(id_prestamo);
        await this.prestamoRepository.remove(prestamo);
    }
    handleDBExceptions(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Ayuda!');
    }
    async deleteAllPrestamos() {
        const query = this.prestamoRepository.createQueryBuilder('prestamo');
        try {
            return await query
                .delete()
                .execute();
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
};
exports.PrestamosService = PrestamosService;
exports.PrestamosService = PrestamosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(entities_1.Prestamo)),
    __param(1, (0, typeorm_2.InjectRepository)(entities_1.PrestamoImage)),
    __param(2, (0, typeorm_2.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _d : Object])
], PrestamosService);
//# sourceMappingURL=prestamos.service.js.map