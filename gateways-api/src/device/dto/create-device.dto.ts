import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'device uid',
  })
  uid: string;

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
