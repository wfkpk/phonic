import {
  Controller,
  Get,
  UseGuards,
  Post,
  Headers,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Response } from 'src/interface/response';
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @Headers('Authorization') token: string,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return await this.roomService.createRoom(createRoomDto, userId);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllRooms(@Headers('Authorization') token: string) {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    console.log(userId);
    return await this.roomService.getAllRooms(userId);
  }

  @Post('/:id/new-message')
  @UseGuards(JwtAuthGuard)
  async newMessage(
    @Headers('Authorization') token: string,
    @Param('id') roomId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return await this.roomService.createMessage(
      userId,
      roomId,
      createMessageDto,
    );
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getRoom(
    @Param('id') roomId: string,
    @Headers('Authorization') token: string,
  ) {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    return await this.roomService.getRoom(roomId, userId);
  }

  @Delete(':id/message/:messageId')
  @UseGuards(JwtAuthGuard)
  async deleteMessage(
    @Param('id') roomId: string,
    @Param('messageId') messageId: string,
    @Headers('Authorization') token: string,
  ): Promise<Response> {
    const userId = await this.jwtService.extractUserId(token.split(' ')[1]);
    const res = await this.roomService.deleteMessage(roomId, userId, messageId);
    return {
      data: res,
      status: 'success',
    };
  }

  @Delete(':id/delete')
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
}
