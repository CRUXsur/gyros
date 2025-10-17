import { Injectable } from '@nestjs/common';
import { BancosService } from '../bancos/bancos.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly bancosService: BancosService,
  ) {}

  async seedBancos() {
    try {
      // Verificar si ya existen bancos
      const bancosExistentes = await this.bancosService.findAll();
      
      if (bancosExistentes.length > 0) {
        return {
          ok: true,
          message: 'Ya existen bancos en la base de datos',
          count: bancosExistentes.length
        };
      }

      // Datos de ejemplo basados en la imagen
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

      // Crear cada banco
      for (const banco of bancosSeed) {
        await this.bancosService.create(banco);
      }

      return {
        ok: true,
        message: 'Bancos creados exitosamente',
        count: bancosSeed.length
      };

    } catch (error) {
      console.error('Error seeding bancos:', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all seed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }
}
