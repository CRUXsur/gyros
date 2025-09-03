import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createUser(createUserDto: CreateUserDto): Promise<{
        token: string;
        id: string;
        email: string;
        password: string;
        fullName: string;
        isActive: boolean;
        roles: string[];
        prestamo: import("../prestamos/entities").Prestamo;
    }>;
    loginUser(loginUserDto: LoginUserDto): Promise<{
        token: string;
        id: string;
        email: string;
        password: string;
        fullName: string;
        isActive: boolean;
        roles: string[];
        prestamo: import("../prestamos/entities").Prestamo;
    }>;
    testingPrivateRoute(request: Express.Request, user: User, userEmail: string, rawHeaders: string[], headers: IncomingHttpHeaders): {
        ok: boolean;
        message: string;
        user: User;
        userEmail: string;
        rawHeaders: string[];
        headers: IncomingHttpHeaders;
    };
    privateRoute2(user: User): {
        ok: boolean;
        user: User;
    };
    privateRoute3(user: User): {
        ok: boolean;
        user: User;
    };
    testingPublicRoute(): {
        ok: boolean;
        message: string;
    };
    checkAuthStatus(user: User): Promise<{
        token: string;
        id: string;
        email: string;
        password: string;
        fullName: string;
        isActive: boolean;
        roles: string[];
        prestamo: import("../prestamos/entities").Prestamo;
    }>;
}
