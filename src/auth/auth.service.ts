import { EncryptService } from '../encryption/encrypt.service';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: EncryptService,
  ) {}

  /**
   * Signs the user to the application by generating JWT tokens
   *
   * @param credentials - The user credentials
   * @returns data - The access and the refresh token to authenticate the user and the user
   */
  async sign(credentials: { email: string; password: string }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user)
      throw new HttpException(
        'The specified user does not exists',
        HttpStatus.BAD_REQUEST,
      );

    const serializedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const isValid = await this.passwordService.comparePassword(
      credentials.password,
      user.password,
    );

    if (!isValid)
      throw new HttpException(
        'The email/password combinaison is invalid',
        HttpStatus.BAD_REQUEST,
      );

    const tokens = await this.jwtService.generateToken(serializedUser);

    return { tokens, user: serializedUser };
  }

  /**
   * Generating new JWT tokens to keep the user authenticated
   *
   * @param token
   * @returns data - The new access and the refresh token to authenticate the user and the user
   */
  async refreshToken(token: string): Promise<any> {
    const user: User = await this.jwtService.verifyToken(token);
    const tokens = await this.jwtService.generateToken(user);

    return { tokens, user };
  }
}
