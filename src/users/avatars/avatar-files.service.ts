import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AvatarFilesService {
  private readonly AVATARS_DIR = path.join(__dirname, '..', '..', 'avatars');

  public savePlainFile(userId: number, buffer: Buffer): void {
    const avatarPath = path.join(this.AVATARS_DIR, userId.toString());
    this.ensureAvatarsFolderExists();
    if (!fs.existsSync(avatarPath)) {
      fs.writeFileSync(avatarPath, buffer);
    }
  }

  public deletePlainFile(userId: number): void {
    const avatarPath = path.join(this.AVATARS_DIR, userId.toString());
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  private ensureAvatarsFolderExists(): void {
    const avatarsPath = path.join(this.AVATARS_DIR);
    if (!fs.existsSync(avatarsPath)) {
      fs.mkdirSync(avatarsPath);
    }
  }
}
