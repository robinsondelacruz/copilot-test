import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  readonly username: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  readonly password: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  readonly username?: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  readonly password?: string;
}
