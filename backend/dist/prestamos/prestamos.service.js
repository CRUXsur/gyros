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
exports.PrestamosService = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let PrestamosService = class PrestamosService {
    prestamoRepository;
    prestamoImageRepository;
    dataSource;
    logger = new common_1.Logger('');
    constructor(prestamoRepository, prestamoImageRepository, dataSource) {
        this.prestamoRepository = prestamoRepository;
        this.prestamoImageRepository = prestamoImageRepository;
        this.dataSource = dataSource;
    }
    async create(createPrestamoDto, user) {
        try {
            const { images = [], ...prestamoDetails } = createPrestamoDto;
            const prestamo = this.prestamoRepository.create({
                ...prestamoDetails,
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
            prestamo = await this.prestamoRepository.findOneBy({ id: term });
        }
        else {
            const queryBuilder = this.prestamoRepository.createQueryBuilder();
            prestamo = await queryBuilder
                .where('UPPER(title) =:title or slug =:slug', {
                title: term.toUpperCase(),
                slug: term.toLowerCase(),
            })
                .leftJoinAndSelect('prestamo.images', 'images')
                .getOne();
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
    async update(id, updatePrestamoDto, user) {
        const { images, ...toUpdate } = updatePrestamoDto;
        const prestamo = await this.prestamoRepository.preload({
            id, ...toUpdate,
        });
        if (!prestamo)
            throw new common_1.NotFoundException(`Prestamo con id ${id} no encontrado`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (images) {
                await queryRunner.manager.delete(entities_1.PrestamoImage, { prestamo: { id } });
                prestamo.images = images.map(image => this.prestamoImageRepository.create({ url: image }));
            }
            else {
                prestamo.images = await this.prestamoImageRepository.findBy({ prestamo: { id } });
            }
            prestamo.user = user;
            await queryRunner.manager.save(prestamo);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return this.findOnePlain(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            this.handleDBExceptions(error);
        }
    }
    async remove(id) {
        const prestamo = await this.findOne(id);
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
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.DataSource])
], PrestamosService);
//# sourceMappingURL=prestamos.service.js.map