import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interface/user.interface';
import { ClientProxy } from '@nestjs/microservices';
import { UserAlreadyExists } from './errors/user-already-exists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @Inject('USERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const registeredUser = await this.findOne(createUserDto.id);

    if (registeredUser) throw new UserAlreadyExists();

    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    await this.client.send({ cmd: 'user_created' }, newUser).subscribe();
    return newUser;
  }

  async findOne(id: number): Promise<IUser> {
    return this.userModel.findOne({ id }).exec();
  }
}
