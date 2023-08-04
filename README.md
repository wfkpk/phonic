# Phonic
Phonic is a Chat application's backend infrastructure written in NestJs/typescript, and we are using Livekit for handling audio/video calls which can hold from 2 to more than 100k users in the same chat room. Phonic has all the functionality a chat app needs. Everything is handled very carefully, from sending messages in the room to joining the voice room.

### Tech-stack
```
-Livekit for audio/video calling (check livekit.service)
-using asymmetric encryption for chat messages (might be the right thing to do)(check encryption.service)
-PostgreSQL as our database
-famous Prisma orm (lets not talk about the abstraction layer in Prisma)
-Passport with JWT strategy for authentication(check auth.guard,jwt.service)
```

----
Buit With NestJS and with ❤️.

---
Reference-
###### [livekit](https://docs.livekit.io/references/server-sdks/)
###### [nestJs](https://nestjs.com/)
###### [PopSpace](https://github.com/with-labs/popspace)
###### [Prima](https://www.prisma.io/)
