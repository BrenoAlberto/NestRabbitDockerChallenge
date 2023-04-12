import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { RegresService } from './regres.service';

describe('RegresService', () => {
  let service: RegresService;
  let httpService: DeepMocked<HttpService>;
  const sucessResponseData = {
    data: {
      id: 1,
      email: 'mock@email.com',
      first_name: 'mock',
      last_name: 'mock',
      avatar: 'mock',
    },
  };
  const successResponse = {
    data: sucessResponseData,
    headers: {},
    config: { url: '' },
    status: 200,
    statusText: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegresService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    service = module.get<RegresService>(RegresService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserData', () => {
    it('should return user data', async () => {
      httpService.axiosRef.mockResolvedValueOnce(successResponse);

      const getUserData = service.getUserData(1);
      await expect(getUserData).resolves.toBe(sucessResponseData.data);
    });

    it('should return null if user does not exist', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        ...successResponse,
        data: {
          ...sucessResponseData,
          data: null,
        },
      });

      const getUserData = service.getUserData(1);
      await expect(getUserData).resolves.toBe(null);
    });
  });

  describe('getUserAvatarBuffer', () => {
    it('should return user avatar buffer', async () => {
      const id = 1;
      const responseBinaryBuffer = Buffer.from('mock', 'binary');
      httpService.axiosRef
        .mockResolvedValueOnce(successResponse)
        .mockResolvedValueOnce({
          ...successResponse,
          data: responseBinaryBuffer,
        });

      const getUserAvatarBuffer = service.getUserAvatarBuffer(id);
      await expect(getUserAvatarBuffer).resolves.toBeInstanceOf(Buffer);
    });

    it('should return null if user does not exist', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        ...successResponse,
        data: {
          ...sucessResponseData,
          data: null,
        },
      });

      const getUserAvatarBuffer = service.getUserAvatarBuffer(1);
      await expect(getUserAvatarBuffer).resolves.toBe(null);
    });

    it('should return null if user avatar does not exist', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        ...successResponse,
        data: {
          ...sucessResponseData,
          data: {
            ...sucessResponseData.data,
            avatar: null,
          },
        },
      });

      const getUserAvatarBuffer = service.getUserAvatarBuffer(1);
      await expect(getUserAvatarBuffer).resolves.toBe(null);
    });
  });
});
