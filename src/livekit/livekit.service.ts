import {
  AccessToken,
  ParticipantInfo,
  // ParticipantPermission,
  // Room,
  RoomServiceClient,
} from 'livekit-server-sdk';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class LivekitService {
  constructor(private readonly prisma: PrismaService) {}

  // async createRoom(createRoomDto: CreateVoiceRoomDto, userId: string) {
  //   const roomName = createRoomDto.name;
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   const token = new AccessToken(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //     {
  //       identity: userId,
  //       metadata: createRoomDto.name,
  //     },
  //   );
  //   token.addGrant({
  //     roomJoin: true,
  //     room: roomName,
  //     roomAdmin: true,
  //     canPublish: true,
  //     canSubscribe: true,
  //   });
  //   return {
  //     token: token.toJwt(),
  //   };
  // }
  // async listRooms(): Promise<Room[]> {
  //   const livekitHost = 'http://localhost:7880/';

  //   const client = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   const rooms = await client.listRooms();
  //   return rooms;
  // }

  // async joinRoom(
  //   roomName: string,
  //   userId: string,
  //   permission: ParticipantPermission,
  // ): Promise<AccessToken> {
  //   const token = new AccessToken(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //     {
  //       identity: userId,
  //       metadata: roomName,
  //       ttl: 60 * 60 * 24,
  //       name: roomName,
  //     },
  //   );
  //   token.addGrant({
  //     roomJoin: true,
  //     room: roomName,
  //     canPublish: permission.canPublish,
  //     canSubscribe: true,
  //   });
  //   return token;
  // }

  // async getRoom(roomName: string, token): Promise<any> {
  //   const livekitHost = 'http://localhost:7880/';

  //   const client = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   const room = await client.deleteRoom(roomName);
  //   return 'success';
  // }

  // async listParticipants(roomName: string): Promise<ParticipantInfo[]> {
  //   const client = new RoomServiceClient(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   const participants = await client.listParticipants(roomName);
  //   return participants;
  // }

  // async removeParticipant(
  //   roomName: string,
  //   participantName: string,
  // ): Promise<void> {
  //   const client = new RoomServiceClient(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   await client.removeParticipant(roomName, participantName);
  // }

  async joinVoiceRoom(chatId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
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
      throw new Error('User not found');
    }
    const token = new AccessToken(
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
      {
        identity: userId,
        metadata: user.avatarUrl,
        name: user.name,
      },
    );
    token.addGrant({
      roomJoin: true,
      room: chatId,
      canPublish: true,
      canSubscribe: true,
    });
    token.toJwt();
    return {
      token: token,
    };
  }

  async getParticipants(
    chatId: string,
    userId: string,
  ): Promise<ParticipantInfo[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        chat: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.chat.some((chat) => chat.id === chatId)) {
      throw new Error('You are not part of this room');
    }
    const livekitHost = 'http://localhost:7880/';
    const svc = new RoomServiceClient(
      livekitHost,
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
    );
    const participants = await svc.listParticipants('chatId');

    return participants;
  }

  // //mute participant
  // async muteParticipant(
  //   roomName: string,
  //   participantName: string,
  // ): Promise<void> {
  //   const client = new RoomServiceClient(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   await client.mutePublishedTrack(roomName, participantName, 'audio', true);
  // }

  // //start a room
  // async createAndJoinRoom(
  //   createRoomDto: CreateVoiceRoomDto,
  // ): Promise<AccessToken> {
  //   const roomName = createRoomDto.name;
  //   const participantName = createRoomDto.participantName;
  //   const token = new AccessToken(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //     {
  //       identity: participantName,
  //     },
  //   );

  //   token.addGrant({
  //     roomJoin: true,
  //     room: roomName,
  //     roomAdmin: true,
  //   });
  //   return token;
  // }

  // async getFeed() {
  //   const livekitHost = 'http://localhost:7880/';
  //   const svc = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   // list rooms
  //   const room = svc.listRooms().then((rooms: Room[]) => {
  //     console.log('existing rooms', rooms);
  //   });
  //   return room;
  // }

  // async createRoom() {
  //   const livekitHost = 'http://localhost:7880/';
  //   const svc = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   // create a new room
  //   const opts = {
  //     name: 'ls',
  //     // timeout in seconds
  //     emptyTimeout: 10 * 60,
  //     maxParticipants: 10,
  //   };
  //   svc.createRoom(opts).then((room: Room) => {
  //     console.log('room created', room);
  //   });
  // }

  // async getListRooms() {
  //   const livekitHost = 'http://localhost:7880/';
  //   const svc = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   // list rooms
  //   svc.listRooms().then((rooms: Room[]) => {
  //     console.log('existing rooms', rooms);
  //   });
  // }

  // async listOfParticipants() {
  // const livekitHost = 'http://localhost:7880/';
  // const svc = new RoomServiceClient(
  //   livekitHost,
  //   process.env.LIVEKIT_API,
  //   process.env.LIVEKIT_SECRET,
  // );
  // const y = await svc.listParticipants('myroom');
  //   console.log(y);
  // }

  // async modfun() {
  //   const livekitHost = 'http://localhost:7880/';
  //   const svc = new RoomServiceClient(
  //     livekitHost,
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );

  //   const permission: ParticipantPermission = {
  //     canPublish: true,
  //     canSubscribe: true,
  //     canPublishData: true,
  //     canUpdateMetadata: true,
  //     canPublishSources: [],
  //     hidden: false,
  //     recorder: false,
  //   };
  // }
}
