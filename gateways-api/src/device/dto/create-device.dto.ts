import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'parent gateway',
  })
  @Optional()
  gateway: string;

  @ApiProperty({
    description: 'device uid',
  })
  uid: number;

  @ApiProperty({
    description: 'device vendor',
  })
  vendor: string;

  @ApiProperty({
    description: 'device creation date',
  })
  creation_date: string;

  @ApiProperty({
    description: 'device status: [online/offline]',
  })
  status: boolean;
}
