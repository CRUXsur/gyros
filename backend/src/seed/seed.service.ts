import { Injectable } from '@nestjs/common';


@Injectable()
export class SeedService {

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
