import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AvatarFilesService } from './avatars/avatar-files.service';
import { AvatarsService } from './avatars/avatars.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegresService } from './regres/regres.service';
import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly avatarFilesService: AvatarFilesService,
    private readonly usersService: UsersService,
    private readonly regresService: RegresService,
  ) {}

  @Post('/users')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);
    return user;
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: number) {
    return await this.regresService.getUserData(userId);
  }

  @Get('/user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: number) {
    const avatarBase64 = await this.avatarsService.getBase64(userId);
    if (avatarBase64) {
      return avatarBase64;
    }
    const buffer = await this.regresService.getUserAvatarBuffer(userId);
    this.avatarFilesService.savePlainFile(userId, buffer);
    const avatar = await this.avatarsService.create({ userId, buffer });
    return avatar.hash;
  }

  @Delete('/user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: number) {
    this.avatarFilesService.deletePlainFile(userId);
    await this.avatarsService.delete(userId);
    return { message: 'Avatar deleted' };
  }
}
