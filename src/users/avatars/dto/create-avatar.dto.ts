import { IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsString()
  readonly userId: number;

  @IsString()
  readonly buffer: Buffer;
}
