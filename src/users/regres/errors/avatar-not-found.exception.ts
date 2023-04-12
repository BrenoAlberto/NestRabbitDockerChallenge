import { HttpException, HttpStatus } from '@nestjs/common';

export class AvatarNotFound extends HttpException {
  constructor() {
    super('Avatar not found!', HttpStatus.NOT_FOUND);
  }
}
