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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async create(createUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            });
            await this.userRepository.save(user);
            return {
                ...user,
                token: this.getJwtToken({ id: user.id })
            };
        }
        catch (error) {
            this.handleDBErrors(error);
        }
    }
    async login(loginUserDto) {
        const { password, email } = loginUserDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true, fullName: true }
        });
        if (!user)
            throw new common_1.UnauthorizedException('Credentials are not valid (email)');
        if (!bcrypt.compareSync(password, user.password))
            throw new common_1.UnauthorizedException('Credentials are not valid (password)');
        const { password: userPassword, ...userWithoutPassword } = user;
        console.log('Login successful for user:', userWithoutPassword);
        return {
            success: true,
            token: this.getJwtToken({ id: user.id }),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            },
            message: 'Login exitoso'
        };
    }
    async checkAuthStatus(user) {
        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }
    getJwtToken(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
    handleDBErrors(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        console.log(error);
        throw new common_1.InternalServerErrorException('Please check server logs');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map