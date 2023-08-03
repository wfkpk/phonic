import { JwtService } from 'src/jwt/jwt.service';
import { Injectable, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { WebSocketAuthGuard } from './socket.guard';

@WebSocketGateway(1080)
@UseGuards(WebSocketAuthGuard)
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  connectedUsers: string[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(socket) {
    console.log(socket.handshake.query.token);
    const user: User = await this.jwtService.verifyToken(
      socket.handshake.query.token,
      true,
    );

    this.connectedUsers = [...this.connectedUsers, String(user.id)];
    this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'ONLINE',
      },
    });

    // Send list of connected users
    this.server.emit('users', this.connectedUsers);
    console.log(user);
  }

  async handleDisconnect(socket) {
    const user: User = await this.jwtService.verifyToken(
      socket.handshake.query.token,
      true,
    );
    const userPos = this.connectedUsers.indexOf(String(user.id));

    if (userPos > -1) {
      this.connectedUsers = [
        ...this.connectedUsers.slice(0, userPos),
        ...this.connectedUsers.slice(userPos + 1),
      ];
    }
    this.prisma.user
      .update({
        where: {
          id: user.id,
        },
        data: {
          status: 'OFFLINE',
        },
      })
      .then((user) => {
        this.server.emit('user', user);
      }, console.error);
  }
  // //now send the message to the room
  // @SubscribeMessage('message')
  // async handleMessage(
  //   socket,
  //   { roomId, message }: { roomId: string; message: string },
  // ) {
  //   console.log('message');
  //   const event = 'message';
  //   const user: User = await this.jwtService.verifyToken(
  //     socket.handshake.query.token,
  //     true,
  //   );
  //   const room = await this.prisma.room.findUnique({
  //     where: {
  //       id: roomId,
  //       users: {
  //         some: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });
  //   console.log(room);
  //   if (!room) {
  //     throw new BadRequestException('Room not found');
  //     HttpStatus.FORBIDDEN;
  //   }
  //   const newMessage = await this.prisma.message.create({
  //     data: {
  //       text: message,
  //       room: {
  //         connect: {
  //           id: room.id,
  //         },
  //       },
  //       user: {
  //         connect: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });
  //   this.server.to(roomId).emit(event, newMessage);
  // }

  // @SubscribeMessage('join')
  // async handleJoinRoom(socket, { roomId }: { roomId: string }) {
  //   const user: User = await this.jwtService.verifyToken(
  //     socket.handshake.query.token,
  //     true,
  //   );
  //   const room = await this.prisma.room.findUnique({
  //     where: {
  //       id: roomId,
  //       users: {
  //         some: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //     include: {
  //       messages: true, // Include all messages in the room
  //     },
  //   });

  //   if (!room) {
  //     throw new BadRequestException('Room not found');
  //   }
  //   //get 25 recent messages
  //   const messages = await this.prisma.message.findMany({
  //     where: {
  //       roomId: room.id,
  //     },
  //     take: 25,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });

  //   socket.join(roomId);

  //   // Emit the messages in the room to the user who just joined
  //   socket.emit('message', messages);
  //   return messages;
  // }

  // @SubscribeMessage('leaveRoom')
  // async handleLeaveRoom(socket, { roomId }: { roomId: string }) {
  //   const user: User = await this.jwtService.verifyToken(
  //     socket.handshake.query.token,
  //     true,
  //   );
  //   const room = await this.prisma.room.findUnique({
  //     where: {
  //       id: roomId,
  //       users: {
  //         some: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });

  //   if (!room) {
  //     throw new BadRequestException('Room not found');
  //     HttpStatus.FORBIDDEN;
  //   }

  //   socket.leave(roomId);
  // }
}
