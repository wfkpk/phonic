import { EncryptService } from 'src/encryption/encrypt.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptService: EncryptService,
  ) {}

  async getRoom(chatId: string, userId: string) {
    //check user is part of that room
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        chat: {
          some: {
            id: chatId,
          },
        },
      },
    });
    if (!user) {
      throw new Error('You are not part of this room');
    }

    const room = await this.prismaService.chat.findUnique({
      where: {
        id: chatId,
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
    const encryptedMessages = room.messages.map((message) => message.text);
    const decryptedMessages = await this.encryptService.decryptListOfMessages(
      chatId,
      encryptedMessages,
    );
    decryptedMessages.forEach((decryptedMessage, index) => {
      room.messages[index].text = decryptedMessage;
    });
    console.log(room);
    return room;
  }
  async createRoom(createRoomDto: CreateRoomDto, userId: string): Promise<any> {
    const { name, about } = createRoomDto;
    const newRoom = await this.prismaService.chat.create({
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
    await this.encryptService.generateKeyPair(newRoom.id);
    await this.prismaService.voiceRoom.create({
      data: {
        name: newRoom.name,
        chatId: newRoom.id,
      },
    });
    return newRoom;
  }

  async createMessage(
    userId: string,
    chatId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const { text } = createMessageDto;
    console.log(text);
    const encryptedMessage = await this.encryptService.encryptMessage(
      chatId,
      text,
    );
    console.log(encryptedMessage);
    // const encryptedMessage = await this.encryptService.encryptMessage(
    //   chatId,
    //   text,
    // );

    const newMessage = await this.prismaService.message.create({
      data: {
        text: encryptedMessage,
        chatId,
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
        chat: {
          select: {
            id: true,
            name: true,
            about: true,
          },
        },
        createdChatRoom: {
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

  async deleteRoom(userId: string, chatId: string): Promise<any> {
    const room = await this.prismaService.chat.findUnique({
      where: {
        id: chatId,
        createdById: userId,
      },
    });
    return {
      room,
      status: 'deleted',
    };
  }

  async deleteMessage(
    chatId: string,
    userId: string,
    messageId: string,
  ): Promise<any> {
    return await this.prismaService.message.delete({
      where: {
        id: messageId,
        userId: userId,
        chatId: chatId,
      },
    });
  }
}
