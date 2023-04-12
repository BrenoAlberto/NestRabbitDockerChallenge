import { HttpException, HttpStatus } from '@nestjs/common';

export class AvatarAlreadyExists extends HttpException {
  constructor() {
    super('Avatar already exists!', HttpStatus.BAD_REQUEST);
  }
}
