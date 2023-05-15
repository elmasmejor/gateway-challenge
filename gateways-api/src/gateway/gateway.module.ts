import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway, GatewaySchema } from './schemas/gateway.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gateway.name, schema: GatewaySchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
