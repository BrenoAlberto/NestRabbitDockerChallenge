import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Avatar {
  @Prop({
    required: true,
    unique: true,
  })
  userId: number;
  @Prop({
    required: true,
  })
  hash: string;
}
export const AvatarSchema = SchemaFactory.createForClass(Avatar);
