import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_CONFIG } from 'src/config';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: APP_CONFIG.jwtSecret,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
