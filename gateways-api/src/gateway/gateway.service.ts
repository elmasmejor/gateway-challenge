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

@Injectable()
export class GatewayService {
  constructor(
    @InjectModel(Gateway.name) private readonly gatewayModel: Model<Gateway>,
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

  findAll() {
    return this.gatewayModel.find();
  }

  findOne(id: string) {
    return this.gatewayModel.findById(id);
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
