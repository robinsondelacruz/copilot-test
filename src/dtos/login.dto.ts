import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  readonly username: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  readonly password: string;
}
