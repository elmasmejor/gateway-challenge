import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/gateway/:gateway/device')
@ApiTags('Device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async create(
    @Param('gateway') gatewayId: string,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    if (await this.deviceService.canCreateDevice(gatewayId)) {
      createDeviceDto.gateway = gatewayId;
      createDeviceDto.date_created = new Date();
      return this.deviceService.create(createDeviceDto);
    } else {
      return {
        code: 409,
        message: 'this gateway has reached maximum number of devices',
      };
    }
  }

  @Get()
  findAll(@Param('gateway') gatewayId: string) {
    return this.deviceService.findAll(gatewayId);
  }

  @Get(':id')
  async findOne(@Param('gateway') gatewayId: string, @Param('id') id: string) {
    if (await this.deviceService.getGateway(gatewayId)) {
      return this.deviceService.findOne(gatewayId, id);
    }
  }

  @Patch(':id')
  async update(
    @Param('gateway') gatewayId: string,
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    if (await this.deviceService.getGateway(gatewayId)) {
      updateDeviceDto.gateway = gatewayId;
      return this.deviceService.update(gatewayId, id, updateDeviceDto);
    }
  }

  @Delete(':id')
  async remove(@Param('gateway') gatewayId: string, @Param('id') id: string) {
    if (await this.deviceService.getGateway(gatewayId)) {
      return this.deviceService.remove(gatewayId, id);
    }
  }
}
