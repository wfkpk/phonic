import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
