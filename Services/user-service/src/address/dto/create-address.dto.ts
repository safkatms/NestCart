// src/address/dto/create-address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber, IsInt, IsEnum } from 'class-validator';

export enum City {
    DHAKA = 'Dhaka',
    CHITTAGONG = 'Chittagong',
    KHULNA = 'Khulna',
    RAJSHAHI = 'Rajshahi',
    SYLHET = 'Sylhet',
    BARISAL = 'Barisal',
    RANGPUR = 'Rangpur',
    MYMENSINGH = 'Mymensingh',
  }

export class CreateAddressDto {
  @ApiProperty({ description: 'Recipient\'s name' })
  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @ApiProperty({ description: 'Recipient\'s phone number (must be a valid Bangladeshi number)' })
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phoneNumber: string;

  @ApiProperty({ description: 'City', enum: City })
  @IsNotEmpty()
  @IsEnum(City)
  city: City;

  @ApiProperty({ description: 'Full address details' })
  @IsNotEmpty()
  @IsString()
  addressLine: string;

  @ApiProperty({ description: 'Optional landmark near the address', required: false })
  @IsOptional()
  @IsString()
  landmark?: string;
}
