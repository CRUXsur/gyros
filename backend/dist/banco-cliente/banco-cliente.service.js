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
exports.BancoClienteService = void 0;
const common_1 = require("@nestjs/common");
const banco_cliente_entity_1 = require("./entities/banco-cliente.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const cliente_entity_1 = require("../clientes/entities/cliente.entity");
let BancoClienteService = class BancoClienteService {
    bancoClienteRepository;
    clienteRepository;
    logger = new common_1.Logger('BancoClienteService');
    constructor(bancoClienteRepository, clienteRepository) {
        this.bancoClienteRepository = bancoClienteRepository;
        this.clienteRepository = clienteRepository;
    }
    async create(createBancoClienteDto) {
        try {
            const { clienteId, ...bancoData } = createBancoClienteDto;
            const cliente = await this.clienteRepository.findOne({
                where: { id_cliente: clienteId },
                relations: ['bancos'],
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente con id ${clienteId} no encontrado`);
            }
            const bancosActivos = cliente.bancos?.filter(b => b.isActive) || [];
            if (bancosActivos.length >= 2) {
                throw new common_1.BadRequestException('El cliente ya tiene 2 bancos activos registrados');
            }
            const bancoCliente = this.bancoClienteRepository.create({
                ...bancoData,
                cliente,
            });
            await this.bancoClienteRepository.save(bancoCliente);
            return bancoCliente;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async findAll() {
        return this.bancoClienteRepository.find({
            relations: ['cliente'],
            where: { isActive: true }
        });
    }
    async findByCliente(clienteId) {
        const cliente = await this.clienteRepository.findOne({
            where: { id_cliente: clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con id ${clienteId} no encontrado`);
        }
        return this.bancoClienteRepository.find({
            where: { cliente: { id_cliente: clienteId } },
            relations: ['cliente'],
            order: { created_at: 'ASC' }
        });
    }
    async findOne(id) {
        const bancoCliente = await this.bancoClienteRepository.findOne({
            where: { id_banco_cliente: id },
            relations: ['cliente'],
        });
        if (!bancoCliente) {
            throw new common_1.NotFoundException(`Banco Cliente con id ${id} no encontrado`);
        }
        return bancoCliente;
    }
    async update(id_banco_cliente, updateBancoClienteDto) {
        try {
            const bancoCliente = await this.findOne(id_banco_cliente);
            const { clienteId, ...bancoData } = updateBancoClienteDto;
            let cliente;
            if (clienteId && clienteId !== bancoCliente.cliente.id_cliente) {
                cliente = await this.clienteRepository.findOneBy({ id_cliente: clienteId });
                if (!cliente) {
                    throw new common_1.NotFoundException(`Cliente con id ${clienteId} no encontrado`);
                }
            }
            const bancoClienteToUpdate = await this.bancoClienteRepository.preload({
                id_banco_cliente: bancoCliente.id_banco_cliente,
                ...bancoData,
                ...(cliente && { cliente }),
            });
            if (!bancoClienteToUpdate) {
                throw new common_1.NotFoundException(`Banco Cliente con id ${id_banco_cliente} no encontrado`);
            }
            await this.bancoClienteRepository.save(bancoClienteToUpdate);
            return this.findOne(id_banco_cliente);
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async remove(id_banco_cliente) {
        const bancoCliente = await this.findOne(id_banco_cliente);
        await this.bancoClienteRepository.remove(bancoCliente);
        return { message: 'Banco Cliente eliminado correctamente' };
    }
    handleDBExceptions(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        if (error.status === 404)
            throw error;
        if (error instanceof common_1.BadRequestException)
            throw error;
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Unexpected error, check server logs');
    }
};
exports.BancoClienteService = BancoClienteService;
exports.BancoClienteService = BancoClienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(banco_cliente_entity_1.BancoCliente)),
    __param(1, (0, typeorm_2.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object])
], BancoClienteService);
//# sourceMappingURL=banco-cliente.service.js.map