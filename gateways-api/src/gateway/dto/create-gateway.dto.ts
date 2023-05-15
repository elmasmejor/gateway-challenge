import { ApiProperty } from '@nestjs/swagger';

export class CreateGatewayDto {
  @ApiProperty({
    description: 'gateway serial number',
  })
  serial_number: string;

  @ApiProperty({
    description: 'gateway name',
  })
  name: string;

  @ApiProperty({
    description: 'gateway ipv4 address',
  })
  ipv4: string;

  @ApiProperty({
    description: 'gateway ipv4 address validated',
  })
  ipv4_valid: string;
}
