import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async getFriends(userId: string): Promise<any> {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [
          {
            aId: userId,
          },
          {
            bId: userId,
          },
        ],
      },
      include: {
        a: true,
        b: true,
      },
    });
    return friends;
  }

  async getFriendRequests(userId: string) {
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        toId: userId,
      },
      include: {
        from: true,
      },
    });
    return friendRequests;
  }

  async acceptFriendRequest(userId: string, friendRequestId: string) {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        toId: userId,
        fromId: friendRequestId,
      },
    });
    if (friendRequest.toId !== userId) {
      throw new Error('Unauthorized');
    }
    const friend = await this.prisma.friend.create({
      data: {
        aId: friendRequest.fromId,
        bId: friendRequest.toId,
      },
    });
    await this.prisma.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });
    return friend;
  }

  async rejectFriendRequest(userId: string, friendRequestId: string) {
    const rejectedFriendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        toId: userId,
        fromId: friendRequestId,
      },
    });
    if (rejectedFriendRequest.toId !== userId) {
      throw new Error('Unauthorized');
    }
    await this.prisma.friendRequest.delete({
      where: {
        id: rejectedFriendRequest.id,
      },
    });
    return rejectedFriendRequest;
  }

  async sendFriendRequest(userId: string, friendRequestId: string) {
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        fromId: userId,
        toId: friendRequestId,
      },
    });
    return friendRequest;
  }

  async deleteFriend(userId: string, friendId: string) {
    const friend = await this.prisma.friend.findFirst({
      where: {
        OR: [
          {
            aId: userId,
            bId: friendId,
          },
          {
            aId: friendId,
            bId: userId,
          },
        ],
      },
    });
    if (!friend) {
      throw new Error('Unauthorized');
    }
    await this.prisma.friend.delete({
      where: {
        id: friend.id,
      },
    });
    return friend;
  }
}
