import { AccessToken, Room, RoomServiceClient } from 'livekit-server-sdk';
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
@Injectable()
export class LivekitService {
  async createAndJoinRoom(createRoomDto: CreateRoomDto): Promise<AccessToken> {
    const roomName = createRoomDto.name;
    const participantName = createRoomDto.participantName;
    const token = new AccessToken(
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
      {
        identity: participantName,
      },
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      roomAdmin: true,
    });
    return token;
  }

  async createRoom() {
    const livekitHost = 'http://localhost:7880/';
    const svc = new RoomServiceClient(
      livekitHost,
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
    );
    // create a new room
    const opts = {
      name: 'myroom',
      // timeout in seconds
      emptyTimeout: 10 * 60,
      maxParticipants: 20,
    };
    svc.createRoom(opts).then((room: Room) => {
      console.log('room created', room);
    });
  }

  async getListRooms() {
    const livekitHost = 'http://localhost:7880/';
    const svc = new RoomServiceClient(
      livekitHost,
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
    );
    // list rooms
    svc.listRooms().then((rooms: Room[]) => {
      console.log('existing rooms', rooms);
    });
  }

  async listOfParticipants() {
    const livekitHost = 'http://localhost:7880/';
    const svc = new RoomServiceClient(
      livekitHost,
      process.env.LIVEKIT_API,
      process.env.LIVEKIT_SECRET,
    );
    const y = await svc.listParticipants('myroom');
    console.log(y);
  }

  // //allowing another member to to speak
  // async allowMemberToSpeak(
  //   roomName: string,
  //   participantName: string,
  // ): Promise<AccessToken> {
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
  //     canPublish: true,
  //   });
  //   return token;
  // }

  // //find all the running rooms on the server using twirp api call
  // async findAllRooms(): Promise<Room[]> {
  //   const allRooms = new RoomServiceClient(
  //     process.env.LIVEKIT_API,
  //     process.env.LIVEKIT_SECRET,
  //   );
  //   const rooms = await allRooms.listRooms();
  //   return rooms;
  // }
}
