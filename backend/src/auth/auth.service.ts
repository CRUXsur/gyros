import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import second from 'bcrypt';
import { hashSync} from 'bcrypt';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {
      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return user; 
      // TODO: retornar el jwt de acceso
    } catch (error) {
      // console.log(error);
      this.handleDBErrors(error);
    }

  }


  async login(loginUserDto: LoginUserDto) {
    const {password, email} = loginUserDto;
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true }
    });

    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');
    
    if (!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credentials are not valid (password)');
    
    return user;
    // TODO: retornar el jwt
  }


  private handleDBErrors(error: any): never{ // never es para que (no devuelva nada)el error no se propague
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }





  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
