import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoom(roomId: string, userId: string) {
    //check user is part of that room
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        Room: {
          some: {
            id: roomId,
          },
        },
      },
    });
    if (!user) {
      throw new Error('You are not part of this room');
    }

    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        name: true,
        about: true,
        messages: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return room;
  }
  async createRoom(createRoomDto: CreateRoomDto, userId: string): Promise<any> {
    const { name, about } = createRoomDto;
    const newRoom = await this.prismaService.room.create({
      data: {
        name,
        about,
        createdBy: {
          connect: {
            id: userId,
          },
        },
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return newRoom;
  }

  async createMessage(
    userId: string,
    roomId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const { message } = createMessageDto;
    const newMessage = await this.prismaService.message.create({
      data: {
        text: message,
        roomId,
        userId,
      },
    });
    return newMessage;
  }

  async getAllRooms(userId: string) {
    const rooms = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        Room: {
          select: {
            id: true,
            name: true,
            about: true,
          },
        },
        CreatedRoom: {
          select: {
            id: true,
            name: true,
            about: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return rooms;
  }

  async deleteRoom(userId: string, roomId: string): Promise<any> {
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
        createdById: userId,
      },
    });
    return {
      room,
      status: 'deleted',
    };
  }

  async deleteMessage(
    roomId: string,
    userId: string,
    messageId: string,
  ): Promise<any> {
    return await this.prismaService.message.delete({
      where: {
        id: messageId,
        userId: userId,
        roomId: roomId,
      },
    });
  }
}
