import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { Model } from 'mongoose';
import { Gateway } from '../gateway/schemas/gateway.schema';
import { Device } from './schemas/device.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('DeviceService', () => {
  let service: DeviceService;
  let gatewayModel: Model<Gateway>;
  let deviceModel: Model<Device>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<DeviceService>(DeviceService);
    gatewayModel = module.get<Model<Gateway>>(getModelToken(Gateway.name));
    deviceModel = module.get<Model<Device>>(getModelToken(Device.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
