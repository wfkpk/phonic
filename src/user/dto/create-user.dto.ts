import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly username: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // @Length(2, 50)
  // readonly bio: string;
}
