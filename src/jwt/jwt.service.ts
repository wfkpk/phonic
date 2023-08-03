import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import * as os from 'os';
import { APP_CONFIG } from 'src/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async generateToken(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      iss: os.hostname(),
    };

    const accessToken = jwt.sign(payload, APP_CONFIG.jwtSecret, {
      expiresIn: APP_CONFIG.accessTokenExpires,
    });
    const refreshToken = jwt.sign(payload, APP_CONFIG.jwtSecret, {
      expiresIn: APP_CONFIG.refreshTokenExpires,
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, isWs = false): Promise<User | null> {
    console.log('verifyToken');
    console.log(token);
    try {
      const payload = jwt.verify(token, APP_CONFIG.jwtSecret) as any;
      return await this.jwtStrategy.validate(payload);
    } catch (error) {
      if (isWs) {
        throw new WsException(error.message);
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  extractUserId(token: string): string {
    try {
      const payload = jwt.verify(token, APP_CONFIG.jwtSecret) as any;
      return payload.sub.id;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
