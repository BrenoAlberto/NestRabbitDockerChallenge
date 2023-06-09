import { Document } from 'mongoose';

export interface IAvatar extends Document {
  readonly userId: number;
  readonly hash: string;
}
