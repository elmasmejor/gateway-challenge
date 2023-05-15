import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { GatewayService } from '../gateway/gateway.service';
import { Model } from 'mongoose';
import { Gateway } from '../gateway/schemas/gateway.schema';
import { Device } from './schemas/device.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;
  let gatewayModel: Model<Gateway>;
  let deviceModel: Model<Device>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        DeviceService,
        {
          provide: getModelToken(Gateway.name),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(Device.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    service = module.get<DeviceService>(DeviceService);
    gatewayModel = module.get<Model<Gateway>>(getModelToken(Gateway.name));
    deviceModel = module.get<Model<Device>>(getModelToken(Device.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
