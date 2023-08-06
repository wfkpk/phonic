import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EncryptService } from 'src/encryption/encrypt.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: EncryptService,
  ) {}

  // async findOne(email: string): Promise<User | null> {
  //   return this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  // }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, username } = createUserDto;
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: username.toLowerCase().replace(' ', '_'),
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOneById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        username: true,
      },
    });
  }

  async updateOneById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const { email, name } = updateUserDto;
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
      },
    });
  }

  async deleteOneById(id: string): Promise<User | null> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      return false;
    }

    return true;
  }

  async searchUserByUsername(username: string): Promise<any> {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        username: true,
        name: true,
        avatarUrl: true,
      },
    });
  }
}
