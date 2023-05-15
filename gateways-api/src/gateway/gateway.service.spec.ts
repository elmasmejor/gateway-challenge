import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { Model } from 'mongoose';
import { Gateway } from './schemas/gateway.schema';
import { Device } from '../device/schemas/device.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('GatewayService', () => {
  let service: GatewayService;
  let gatewayModel: Model<Gateway>;
  let deviceModel: Model<Device>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
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

    service = module.get<GatewayService>(GatewayService);
    gatewayModel = module.get<Model<Gateway>>(getModelToken(Gateway.name));
    deviceModel = module.get<Model<Device>>(getModelToken(Device.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
