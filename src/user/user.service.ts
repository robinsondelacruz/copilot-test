import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { envs } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
}
