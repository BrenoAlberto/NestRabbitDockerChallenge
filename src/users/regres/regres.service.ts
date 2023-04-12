import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AvatarNotFound } from './errors/avatar-not-found.exception';
import { UserNotFound } from './errors/user-not-found.exception';
import { RegresUserType } from './types/regres-user.type';

@Injectable()
export class RegresService {
  constructor(private http: HttpService) {}
  async getUserData(userId: number): Promise<RegresUserType> {
    try {
      const { data } = await this.http.axiosRef({
        method: 'GET',
        url: `https://reqres.in/api/users/${userId}`,
      });
      return data?.data;
    } catch (error) {
      if (error.response.status === 404) throw new UserNotFound();
    }
  }

  async getUserAvatarBuffer(userId: number): Promise<Buffer> {
    const userData = await this.getUserData(userId);
    const avatarUrl = userData?.avatar;

    if (!avatarUrl) return null;

    try {
      const { data } = await this.http.axiosRef({
        method: 'GET',
        url: avatarUrl,
        responseType: 'arraybuffer',
      });

      if (data instanceof Buffer === false) return null;

      return Buffer.from(data, 'binary');
    } catch (error) {
      if (error.response.status === 404) throw new AvatarNotFound();
    }
  }
}
