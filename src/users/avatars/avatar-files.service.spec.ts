import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { AvatarFilesService } from './avatar-files.service';

jest.mock('fs', () => ({
  existsSync(): boolean {
    return true;
  },

  writeFileSync(): void {
    return;
  },

  unlinkSync(): void {
    return;
  },

  mkdirSync(): void {
    return;
  },
}));

describe('AvatarFilesService', () => {
  let service: AvatarFilesService;
  const avatarsDir = path.join(__dirname, '..', '..', 'avatars');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarFilesService],
    }).compile();

    service = module.get<AvatarFilesService>(AvatarFilesService);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('savePlainFile', () => {
    it('should create avatars folder if it does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

      const spy = jest.spyOn(fs, 'mkdirSync');
      service.savePlainFile(1, Buffer.from('test'));

      expect(spy).toHaveBeenCalledWith(avatarsDir);
    });

    it('should not create avatars folder if it exists', () => {
      jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const spy = jest.spyOn(fs, 'mkdirSync');
      service.savePlainFile(1, Buffer.from('test'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('should save file if it does not exist', () => {
      jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const spy = jest.spyOn(fs, 'writeFileSync');
      service.savePlainFile(1, Buffer.from('test'));
      expect(spy).toHaveBeenCalled();
    });

    it('should not save file if it exists', () => {
      const spy = jest.spyOn(fs, 'writeFileSync');
      service.savePlainFile(1, Buffer.from('test'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should save file with correct path and buffer', () => {
      jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const spy = jest.spyOn(fs, 'writeFileSync');
      service.savePlainFile(1, Buffer.from('test'));
      expect(spy).toHaveBeenCalledWith(
        path.join(avatarsDir, '1'),
        Buffer.from('test'),
      );
    });
  });

  describe('deletePlainFile', () => {
    it('should delete file if it exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

      const spy = jest.spyOn(fs, 'unlinkSync');
      service.deletePlainFile(1);
      expect(spy).toHaveBeenCalled();
    });

    it('should not delete file if it does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

      const spy = jest.spyOn(fs, 'unlinkSync');
      service.deletePlainFile(1);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
