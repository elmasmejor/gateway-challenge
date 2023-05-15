import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { Gateway } from './schemas/gateway.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Device } from '../device/schemas/device.schema';

describe('GatewayController', () => {
  let controller: GatewayController;
  let service: GatewayService;
  let gatewayModel: Model<Gateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
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

    controller = module.get<GatewayController>(GatewayController);
    service = module.get<GatewayService>(GatewayService);
    gatewayModel = module.get<Model<Gateway>>(getModelToken(Gateway.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const gateways = await gatewayModel.find();
      expect(await controller.findAll()).toEqual(gateways);
    });
  });
});
