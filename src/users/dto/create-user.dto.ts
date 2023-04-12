import { IsEmail, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsPositive()
  readonly id: number;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsString()
  readonly avatar: string;
}
