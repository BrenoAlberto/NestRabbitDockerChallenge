import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test-utils/MongooseTestModule';
import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersServiceClient: DeepMocked<ClientProxy>;
  const createUserDtoMock: CreateUserDto = {
    id: 1,
    email: 'mock@email.com',
    first_name: 'mock',
    last_name: 'mock',
    avatar: 'mock',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [
        UsersService,
        {
          provide: 'USERS_SERVICE',
          useValue: createMock<ClientProxy>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersServiceClient = module.get('USERS_SERVICE');
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const result = await service.create(createUserDtoMock);
      expect(result).toHaveProperty('id', createUserDtoMock.id);
      expect(result).toHaveProperty('email', createUserDtoMock.email);
    });

    it('should throw an error if user already exists', async () => {
      await service.create(createUserDtoMock);
      expect(service.create(createUserDtoMock)).rejects.toThrow();
    });

    it('should call the client proxy to create a new user', async () => {
      const spy = jest.spyOn(usersServiceClient, 'send');
      const createdUser = await service.create(createUserDtoMock);
      expect(spy).toBeCalledWith(
        {
          cmd: 'user_created',
        },
        createdUser,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const createdUser = await service.create(createUserDtoMock);
      const foundUser = await service.findOne(createdUser.id);
      expect(foundUser).toHaveProperty('id', createUserDtoMock.id);
    });

    it('should return null if user does not exist', async () => {
      await expect(service.findOne(1)).resolves.toBeNull();
    });
  });
});
