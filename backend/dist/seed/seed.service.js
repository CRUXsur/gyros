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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("../bancos/bancos.service");
let SeedService = class SeedService {
    bancosService;
    constructor(bancosService) {
        this.bancosService = bancosService;
    }
    async seedBancos() {
        try {
            const bancosExistentes = await this.bancosService.findAll();
            if (bancosExistentes.length > 0) {
                return {
                    ok: true,
                    message: 'Ya existen bancos en la base de datos',
                    count: bancosExistentes.length
                };
            }
            const bancosSeed = [
                {
                    banco: 'UNImovilPLUS',
                    noCta: '10002048788',
                    nombre: 'JUAN PEREZ',
                    moneda: 'BOLIVIANOS',
                    isActive: true
                },
                {
                    banco: 'BNB',
                    noCta: '10002048788',
                    nombre: 'JUAN PEREZ',
                    moneda: 'BOLIVIANOS',
                    isActive: true
                },
                {
                    banco: 'BCP',
                    noCta: '10002048788',
                    nombre: 'JUAN PEREZ',
                    moneda: 'BOLIVIANOS',
                    isActive: true
                },
                {
                    banco: 'COOPERATIVA',
                    noCta: '10002048788',
                    nombre: 'JUAN PEREZ',
                    moneda: 'BOLIVIANOS',
                    isActive: true
                }
            ];
            for (const banco of bancosSeed) {
                await this.bancosService.create(banco);
            }
            return {
                ok: true,
                message: 'Bancos creados exitosamente',
                count: bancosSeed.length
            };
        }
        catch (error) {
            console.error('Error seeding bancos:', error);
            throw error;
        }
    }
    findAll() {
        return `This action returns all seed`;
    }
    findOne(id) {
        return `This action returns a #${id} seed`;
    }
    remove(id) {
        return `This action removes a #${id} seed`;
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], SeedService);
//# sourceMappingURL=seed.service.js.map