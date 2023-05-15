import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gateway } from '../gateway/schemas/gateway.schema';
import { Model } from 'mongoose';
import { Device } from './schemas/device.schema';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
    @InjectModel(Gateway.name) private readonly gatewayModel: Model<Gateway>,
  ) {}

  create(createDeviceDto: CreateDeviceDto) {
    return this.deviceModel.create(createDeviceDto);
  }

  findAll(gatewayId: string) {
    return this.deviceModel.find({ gateway: gatewayId }).exec();
  }

  findOne(gatewayId: string, id: string) {
    return this.deviceModel.findOne({ _id: id, gateway: gatewayId });
  }

  update(gatewayId: string, id: string, updateDeviceDto: UpdateDeviceDto) {
    return this.deviceModel.findOneAndUpdate(
      {
        gateway: gatewayId,
        _id: id,
      },
      updateDeviceDto,
      { new: true },
    );
  }

  remove(gatewayId: string, id: string) {
    return this.deviceModel
      .findOneAndRemove({ _id: id, gateway: gatewayId })
      .exec();
  }

  async getGateway(id: string) {
    const gateway = await this.gatewayModel.findById(id);
    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    } else return gateway;
  }

  async canCreateDevice(gatewayId: string) {
    try {
      const result = await this.deviceModel.find({ gateway: gatewayId });
      return result.length < 3;
    } catch (e) {
      throw new BadRequestException('error find devices on create');
    }
  }
}
