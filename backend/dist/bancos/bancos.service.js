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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancosService = void 0;
const common_1 = require("@nestjs/common");
const banco_entity_1 = require("./entities/banco.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let BancosService = class BancosService {
    bancoRepository;
    logger = new common_1.Logger('BancosService');
    constructor(bancoRepository) {
        this.bancoRepository = bancoRepository;
    }
    async create(createBancoDto) {
        try {
            const banco = this.bancoRepository.create(createBancoDto);
            await this.bancoRepository.save(banco);
            return banco;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    findAll() {
        return this.bancoRepository.find({
            where: { isActive: true }
        });
    }
    async findOne(id) {
        const banco = await this.bancoRepository.findOneBy({ id_banco: id });
        if (!banco) {
            throw new common_1.NotFoundException(`Banco con id ${id} no encontrado`);
        }
        return banco;
    }
    async update(id_banco, updateBancoDto) {
        try {
            const banco = await this.findOne(id_banco);
            const bancoToUpdate = await this.bancoRepository.preload({
                id_banco: banco.id_banco,
                ...updateBancoDto,
            });
            if (!bancoToUpdate) {
                throw new common_1.NotFoundException(`Banco con id ${id_banco} no encontrado`);
            }
            await this.bancoRepository.save(bancoToUpdate);
            return bancoToUpdate;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async remove(id_banco) {
        const banco = await this.findOne(id_banco);
        await this.bancoRepository.remove(banco);
    }
    handleDBExceptions(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Unexpected error, check server logs');
    }
};
exports.BancosService = BancosService;
exports.BancosService = BancosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(banco_entity_1.Banco)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], BancosService);
//# sourceMappingURL=bancos.service.js.map