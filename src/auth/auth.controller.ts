import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() authDto: AuthDto): Promise<any> {
    if (!authDto)
      throw new HttpException('Body is missing', HttpStatus.BAD_REQUEST);
    if (!authDto.email || !authDto.password)
      throw new HttpException(
        'Missing email or password',
        HttpStatus.BAD_REQUEST,
      );

    return await this.authService.sign(authDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    return await this.authService.refreshToken(body.refreshToken);
  }
}