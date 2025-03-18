import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { envs } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const hashedPassword = await hash(password, envs.bcryptSaltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    delete newUser.password;

    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;

    const token = this.generateJWT(user.id);

    return { user, token };
  }

  generateJWT(userId: number) {
    const payload = { sub: userId };

    return this.jwtService.sign(payload);
  }
}
