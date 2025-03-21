import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  password: string;
}
