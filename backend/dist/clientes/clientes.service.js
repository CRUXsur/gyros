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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const cliente_entity_1 = require("./entities/cliente.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const uuid_1 = require("uuid");
const prestamo_entity_1 = require("../prestamos/entities/prestamo.entity");
const cuota_entity_1 = require("../cuotas/entities/cuota.entity");
let ClientesService = class ClientesService {
    clienteRepository;
    prestamoRepository;
    cuotaRepository;
    logger = new common_1.Logger('');
    constructor(clienteRepository, prestamoRepository, cuotaRepository) {
        this.clienteRepository = clienteRepository;
        this.prestamoRepository = prestamoRepository;
        this.cuotaRepository = cuotaRepository;
    }
    async create(createClienteDto) {
        try {
            const cliente = this.clienteRepository.create(createClienteDto);
            await this.clienteRepository.save(cliente);
            return cliente;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async findAll() {
        const clientes = await this.clienteRepository.find({});
        const clientesConDatos = await Promise.all(clientes.map(async (cliente) => {
            const prestamos = await this.prestamoRepository.find({
                where: {
                    cliente: { id_cliente: cliente.id_cliente },
                    isActive: true
                },
                order: { fecha_prestamo: 'DESC' }
            });
            let monto_prestado = null;
            let monto_cuota = null;
            if (prestamos.length > 0) {
                const prestamoActual = prestamos[0];
                monto_prestado = prestamoActual.monto_prestado;
                const cuotas = await this.cuotaRepository.find({
                    where: {
                        prestamo: { id_prestamo: prestamoActual.id_prestamo },
                        isActive: true
                    },
                    order: { numero_cuota: 'ASC' }
                });
                if (cuotas.length > 0) {
                    monto_cuota = cuotas[0].monto_cuota;
                }
            }
            return {
                ...cliente,
                monto_prestado,
                monto_cuota,
                prestamos
            };
        }));
        return clientesConDatos;
    }
    async findOne(term) {
        let cliente;
        if ((0, uuid_1.validate)(term)) {
            cliente = await this.clienteRepository.findOneBy({ id_cliente: term });
        }
        else {
            cliente = await this.clienteRepository.findOneBy({ ci: term });
        }
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con id ${term} no encontrado`);
        }
        return cliente;
    }
    async findByDeviceId(device_id) {
        const cliente = await this.clienteRepository.findOneBy({ device_id });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con device_id ${device_id} no encontrado`);
        }
        return cliente;
    }
    async update(id_cliente, updateClienteDto) {
        try {
            const cliente = await this.findOne(id_cliente);
            const clienteToUpdate = await this.clienteRepository.preload({
                id_cliente: cliente.id_cliente,
                ...updateClienteDto,
            });
            if (!clienteToUpdate) {
                throw new common_1.NotFoundException(`Cliente con id ${id_cliente} no encontrado`);
            }
            await this.clienteRepository.save(clienteToUpdate);
            return clienteToUpdate;
        }
        catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async remove(id_cliente) {
        const cliente = await this.findOne(id_cliente);
        await this.clienteRepository.remove(cliente);
    }
    handleDBExceptions(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Unexpected error, check server logs');
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cliente_entity_1.Cliente)),
    __param(1, (0, typeorm_2.InjectRepository)(prestamo_entity_1.Prestamo)),
    __param(2, (0, typeorm_2.InjectRepository)(cuota_entity_1.Cuota)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map