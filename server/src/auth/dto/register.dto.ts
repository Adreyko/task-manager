import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  // @ApiProperty()
  // photoUrl?: string;
}
