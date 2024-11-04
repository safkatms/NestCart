// src/address/dto/update-address.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ description: 'ID of the address to update' })
  id: number;
}
