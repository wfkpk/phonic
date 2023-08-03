import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 50)
  readonly about: string;
}
