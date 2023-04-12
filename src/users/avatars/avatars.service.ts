import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarAlreadyExists } from './errors/avatar-already-exists.exception';
import { IAvatar } from './interface/avatar.interface';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectModel('Avatar') private readonly avatarModel: Model<IAvatar>,
  ) {}

  async create(createAvatarDto: CreateAvatarDto): Promise<IAvatar> {
    const registeredAvatar = await this.avatarModel.findOne({
      userId: createAvatarDto.userId,
    });
    if (registeredAvatar) throw new AvatarAlreadyExists();
    const newAvatar = new this.avatarModel({
      userId: createAvatarDto.userId,
      hash: createAvatarDto.buffer.toString('base64'),
    });
    return newAvatar.save();
  }

  async delete(userId: number): Promise<void> {
    const avatar = await this.avatarModel.findOne({ userId }).exec();
    await avatar.remove();
  }

  async getBase64(userId: number): Promise<string> {
    const avatar = await this.avatarModel.findOne({ userId }).exec();
    return avatar?.hash ?? null;
  }
}
