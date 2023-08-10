import {
  Controller,
  Get,
  UseGuards,
  Post,
  Headers,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard, ModAuthGuard } from 'src/guard/auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Response } from 'src/interface/response';
import { EncryptService } from 'src/encryption/encrypt.service';
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Headers('Authorization') token: string,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: await this.roomService.createRoom(createRoomDto, userId),
      status: 'success',
    };
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllRooms(
    @Headers('Authorization') token: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    console.log(userId);
    return {
      data: await this.roomService.getAllRooms(userId),
      status: 'success',
    };
  }

  @Post('/:id/new-message')
  @UseGuards(JwtAuthGuard)
  async newMessage(
    @Headers('Authorization') token: string,
    @Param('id') roomId: string,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: await this.roomService.createMessage(
        userId,
        roomId,
        createMessageDto,
      ),
      status: 'success',
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getRoom(
    @Param('id') roomId: string,
    @Headers('Authorization') token: string,
    @Query('cursor') cursor: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: await this.roomService.getRoom(roomId, userId, cursor),
      status: 'success',
    };
  }

  // @Delete(':id/message/:messageId')
  // @UseGuards(JwtAuthGuard)
  // async deleteMessage(
  //   @Param('id') roomId: string,
  //   @Param('messageId') messageId: string,
  //   @Headers('Authorization') token: string,
  // ): Promise<Response> {
  //   const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
  //   const res = await this.roomService.deleteMessage(roomId, userId, messageId);
  //   return {
  //     data: res,
  //     status: 'success',
  //   };
  // }

  @Delete(':id/delete')
  @UseGuards(ModAuthGuard)
  async deleteRoom(
    @Param(':id') roomId: string,
    @Headers('Authorization') token: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    const res = await this.roomService.deleteRoom(userId, roomId);
    return {
      data: res,
      status: 'success',
    };
  }

  @Get('/:id/status')
  @UseGuards(JwtAuthGuard)
  async getRoomStatus(
    @Param('id') roomId: string,
    @Headers('Authorization') token: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: (await this.roomService.getRoomStatus(userId, roomId))
        .onlineUserCount,
      status: 'success',
    };
  }

  @Post('/:id/invite')
  @UseGuards(JwtAuthGuard, ModAuthGuard)
  async inviteUser(
    @Param('id') roomId: string,
    @Headers('Authorization') token: string,
    @Body() body: { username: string },
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: await this.roomService.inviteUser(userId, roomId, body.username),
      status: 'success',
    };
  }

  @Delete('/:id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveRoom(
    @Param('id') roomId: string,
    @Headers('Authorization') token: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return {
      data: await this.roomService.leaveRoom(userId, roomId),
      status: 'success',
    };
  }
}
