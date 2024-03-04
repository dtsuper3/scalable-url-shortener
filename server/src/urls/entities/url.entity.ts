import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Url>;

@Schema({
  versionKey: false,
  toJSON: {
    transform: function (doc, ret, game) {
      delete ret.__v;
    },
  },
})
export class Url {
  @Prop()
  url: string;

  @Prop()
  shortUrl: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
