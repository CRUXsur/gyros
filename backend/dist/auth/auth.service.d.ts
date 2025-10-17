import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<any>;
    login(loginUserDto: LoginUserDto): Promise<{
        success: boolean;
        token: any;
        user: {
            id: any;
            email: any;
            fullName: any;
        };
        message: string;
    }>;
    checkAuthStatus(user: User): Promise<{
        token: any;
        id: string;
        email: string;
        password: string;
        fullName: string;
        isActive: boolean;
        roles: string[];
        prestamo: import("../prestamos/entities").Prestamo;
    }>;
    private getJwtToken;
    private handleDBErrors;
}
