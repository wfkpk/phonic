import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;

    if (!token) {
      return false;
    }

    try {
      const user = await this.jwtService.verifyToken(token, true);
      client.user = user; // Attach the user to the WebSocket client object for easy access in the ChatGateway.
      return true;
    } catch (error) {
      return false;
    }
  }
}
