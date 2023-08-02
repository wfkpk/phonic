import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_CONFIG } from 'src/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: APP_CONFIG.jwtSecret,
      signOptions: { expiresIn: APP_CONFIG.accessTokenExpires },
    }),
  ],
  providers: [JwtService, JwtStrategy],
  exports: [JwtService, JwtStrategy],
})
export class TokenModule {}
