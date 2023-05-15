import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GatewayDocument = HydratedDocument<Gateway>;
@Schema()
export class Gateway {
  @Prop({ type: String, unique: true })
  serial_number: string;

  @Prop()
  name: string;

  @Prop()
  ipv4: string;

  @Prop({ type: Boolean, default: false })
  ipv4_validated: boolean;
}
export const GatewaySchema = SchemaFactory.createForClass(Gateway);
