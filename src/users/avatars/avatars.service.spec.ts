import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarSchema } from './schema/avatar.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/MongooseTestModule';

describe('AvatarsService', () => {
  let avatarsService: AvatarsService;
  const createAvatarDtoMock: CreateAvatarDto = {
    userId: 1,
    buffer: Buffer.from('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
      ],
      providers: [AvatarsService],
    }).compile();

    avatarsService = module.get<AvatarsService>(AvatarsService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(avatarsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new avatar successfully', async () => {
      const result = await avatarsService.create(createAvatarDtoMock);

      expect(result).toHaveProperty('userId', createAvatarDtoMock.userId);
      expect(result).toHaveProperty(
        'hash',
        createAvatarDtoMock.buffer.toString('base64'),
      );
    });

    it('should throw an error if avatar already exists', async () => {
      await avatarsService.create(createAvatarDtoMock);
      await expect(
        avatarsService.create(createAvatarDtoMock),
      ).rejects.toThrow();
    });

    it('should throw an error if userId is not provided', async () => {
      await expect(
        avatarsService.create({
          ...createAvatarDtoMock,
          userId: null,
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if buffer is not provided', async () => {
      await expect(
        avatarsService.create({
          ...createAvatarDtoMock,
          buffer: null,
        }),
      ).rejects.toThrow();
    });
  });

  describe('getBase64', () => {
    it('should get avatar base64 string successfully', async () => {
      const result = await avatarsService.create(createAvatarDtoMock);
      const avatar = await avatarsService.getBase64(result.userId);
      expect(avatar).toBe(createAvatarDtoMock.buffer.toString('base64'));
    });

    it('should return null if avatar base64 string does not exist', async () => {
      const avatar = await avatarsService.getBase64(1);
      expect(avatar).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete avatar successfully', async () => {
      const result = await avatarsService.create(createAvatarDtoMock);
      await avatarsService.delete(result.userId);
      const avatar = await avatarsService.getBase64(result.userId);
      expect(avatar).toBeNull();
    });

    it('should throw an error if avatar does not exist', async () => {
      await expect(avatarsService.delete(1)).rejects.toThrow();
    });
  });
});
