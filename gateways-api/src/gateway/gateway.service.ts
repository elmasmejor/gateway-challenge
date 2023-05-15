import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gateway } from './schemas/gateway.schema';
import { Model } from 'mongoose';
import { Device } from '../device/schemas/device.schema';

@Injectable()
export class GatewayService {
  constructor(
    @InjectModel(Gateway.name) private readonly gatewayModel: Model<Gateway>,
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>,
  ) {}

  async create(createGatewayDto: CreateGatewayDto) {
    try {
      return await this.gatewayModel.create(createGatewayDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          'a gateway with this [serial number] is already registered',
        );
      }
    }
  }

  async findAll() {
    return this.gatewayModel.find();
  }

  async findOne(id: string): Promise<any> {
    const gateway = await this.gatewayModel.findById(id).lean();
    const devices = await this.deviceModel.find({ gateway: id }).lean();
    return { gateway, devices };
  }

  async update(id: string, updateGatewayDto: UpdateGatewayDto) {
    const existingGateway = await this.gatewayModel.findByIdAndUpdate(
      id,
      updateGatewayDto,
      { new: true },
    );
    if (!existingGateway) {
      throw new NotFoundException(`Gateway [${id}] not found`);
    }
    return existingGateway;
  }

  remove(id: string) {
    return this.gatewayModel.findByIdAndRemove({ _id: id }).exec();
  }
}
