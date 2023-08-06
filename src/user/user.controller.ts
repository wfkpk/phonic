import { JwtService } from 'src/jwt/jwt.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Headers,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { Auth } from 'src/auth/auth.decorator';
import { Response } from 'src/interface/response';

@Controller('/u')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response> {
    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      data: user,
      status: 'success',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Auth()
  async getProfile(
    @Headers('authorization') authorization: string,
  ): Promise<Response> {
    const token = authorization.split(' ')[1];
    const userId = this.jwtService.extractUserId(token);
    return {
      data: await this.userService.findOneById(userId),
      status: 'success',
    };
  }

  // @Get('/all')
  // async findAll(): Promise<User[]> {
  //   return await this.userService.findAll();
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Response> {
    return {
      data: await this.userService.findOneById(id),
      status: 'success',
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response> {
    return {
      data: await this.userService.updateOneById(id, updateUserDto),
      status: 'success',
    };
  }

  @Get('/username')
  async isUsernameAvailable(
    @Query('username') username: string,
  ): Promise<Response> {
    return {
      data: await this.userService.isUsernameAvailable(username),
      status: 'success',
    };
  }

  @Get('query/username')
  async findOneByUsername(
    @Query('username') username: string,
  ): Promise<Response> {
    return {
      data: await this.userService.searchUserByUsername(username),
      status: 'success',
    };
  }
}
