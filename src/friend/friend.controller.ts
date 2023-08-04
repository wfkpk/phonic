import {
  Controller,
  Param,
  Body,
  Get,
  Delete,
  Patch,
  UseGuards,
  Headers,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { FriendService } from './friend.service';
import { JwtService } from 'src/jwt/jwt.service';
import { Response } from 'src/interface/response';
@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFriends(@Headers('authorization') token: string): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    const friends = await this.friendService.getFriends(userId);
    return {
      data: friends,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('request')
  async getFriendRequests(
    @Headers('authorization') token: string,
  ): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    const friendRequests = await this.friendService.getFriendRequests(userId);
    return {
      data: friendRequests,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('request/:friendRequestId')
  async acceptFriendRequest(
    @Headers('authorization') token: string,
    @Param('friendRequestId') friendRequestId: string,
  ): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    const friend = await this.friendService.acceptFriendRequest(
      userId,
      friendRequestId,
    );
    return {
      data: friend,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('request/:friendRequestId')
  async rejectFriendRequest(
    @Headers('authorization') token: string,
    @Param('friendRequestId') friendRequestId: string,
  ): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    await this.friendService.rejectFriendRequest(userId, friendRequestId);
    return {
      data: null,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':friendId')
  async deleteFriend(
    @Headers('authorization') token: string,
    @Param('friendId') friendId: string,
  ): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    await this.friendService.deleteFriend(userId, friendId);
    return {
      data: null,
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':friendId')
  async sendFriendRequest(
    @Headers('authorization') token: string,
    @Param('friendId') friendId: string,
  ): Promise<Response> {
    const userId = this.jwtService.extractUserId(token.split(' ')[1]);
    const friendRequest = await this.friendService.sendFriendRequest(
      userId,
      friendId,
    );
    return {
      data: friendRequest,
      status: 'success',
    };
  }
}
