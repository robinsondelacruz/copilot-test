import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { envs } from 'src/config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: { expiresIn: envs.jwtExpiresIn },
        };
      },
    }),
  ],
})
export class UserModule {}
