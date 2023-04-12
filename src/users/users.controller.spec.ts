import { Test, TestingModule } from '@nestjs/testing';
import { AvatarFilesService } from './avatars/avatar-files.service';
import { AvatarsService } from './avatars/avatars.service';
import { CreateAvatarDto } from './avatars/dto/create-avatar.dto';
import { IAvatar } from './avatars/interface/avatar.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/user.interface';
import { RegresService } from './regres/regres.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let avatarsServiceMock: Partial<AvatarsService>;
  let avatarFilesServiceMock: Partial<AvatarFilesService>;
  let usersServiceMock: Partial<UsersService>;
  let regresServiceMock: Partial<RegresService>;

  const createUserDtoMock: CreateUserDto = {
    id: 1,
    email: 'mock@email.com',
    first_name: 'mock',
    last_name: 'mock',
    avatar: 'mock',
  };

  const createAvatarDtoMock: CreateAvatarDto = {
    userId: 1,
    buffer: Buffer.from('mock'),
  };

  beforeEach(async () => {
    avatarsServiceMock = {
      getBase64: () => Promise.resolve(Buffer.from('mock').toString('base64')),
      create: (dto: CreateAvatarDto) =>
        Promise.resolve({
          userId: dto.userId,
          hash: dto.buffer.toString('base64'),
        } as IAvatar),
      delete: jest.fn(),
    };

    avatarFilesServiceMock = {
      savePlainFile: jest.fn(),
      deletePlainFile: jest.fn(),
    };

    usersServiceMock = {
      create: (dto: CreateUserDto) => {
        return Promise.resolve(dto as IUser);
      },
    };

    regresServiceMock = {
      getUserData: (id: number) => {
        return Promise.resolve({
          id,
          ...createUserDtoMock,
        });
      },
      getUserAvatarBuffer: () => Promise.resolve(Buffer.from('mock')),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AvatarsService, useValue: avatarsServiceMock },
        { provide: AvatarFilesService, useValue: avatarFilesServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: RegresService, useValue: regresServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const result = await controller.createUser(createUserDtoMock);
      expect(result).toHaveProperty('id', createUserDtoMock.id);
      expect(result).toHaveProperty('email', createUserDtoMock.email);
    });
  });

  describe('getUser from regres', () => {
    it('should get user from regres', async () => {
      const result = await controller.getUser(createUserDtoMock.id);
      expect(result).toHaveProperty('id', createUserDtoMock.id);
      expect(result).toHaveProperty('email', createUserDtoMock.email);
    });
  });

  describe('getUserAvatar', () => {
    it('should get registered in db user avatar base64', async () => {
      const result = await controller.getUserAvatar(createUserDtoMock.id);
      expect(result).toEqual(createAvatarDtoMock.buffer.toString('base64'));
    });

    it('should fetch user avatar base64 from regres', async () => {
      avatarsServiceMock.getBase64 = () => null;
      const result = await controller.getUserAvatar(createUserDtoMock.id);
      expect(result).toEqual(createAvatarDtoMock.buffer.toString('base64'));
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete user avatar', async () => {
      const result = await controller.deleteUserAvatar(createUserDtoMock.id);
      expect(result).toHaveProperty('message', 'Avatar deleted');
    });
  });
});
