import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {
      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      // delete User.Password;
            
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      } 
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
      select: { email: true, password: true, id: true }
    });

    if (!user) 
      throw new UnauthorizedException('Credentials are not valid (email)');
    
    if (!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credentials are not valid (password)');
    
    // const { password: userPassword, ...userWithoutPassword } = user;
    console.log(user);
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
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
