import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Url>;

@Schema({
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
    },
  },
})
export class Url {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true })
  shortUrl: string;

  @Prop({ default: 0 })
  visits: number;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
