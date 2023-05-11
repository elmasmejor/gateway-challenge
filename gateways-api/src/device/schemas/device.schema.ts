import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeviceDocument = HydratedDocument<Device>;
@Schema()
export class Device {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  gateway: mongoose.Types.ObjectId;

  @Prop({ type: Number })
  uid: number;

  @Prop()
  vendor: string;

  @Prop()
  created_date: Date;

  @Prop({ type: Boolean, default: false })
  status: boolean;
}
export const DeviceSchema = SchemaFactory.createForClass(Device);
