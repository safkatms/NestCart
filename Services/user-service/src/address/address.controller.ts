// src/address/address.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Import JwtAuthGuard

@ApiTags('Addresses')
@ApiBearerAuth('access-token') // Add Bearer auth for Swagger documentation
@UseGuards(JwtAuthGuard) // Apply JWT auth guard to all routes
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully', type: Address })
  async createAddress(
    @Req() req, // Add the request parameter to access user data
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const userId = req.user.userId; // Get the user ID from the request
    return this.addressService.createAddress(userId, createAddressDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiResponse({ status: 200, description: 'Return all user addresses', type: [Address] })
  async findAllUserAddresses(@Req() req): Promise<Address[]> {
    const userId = req.user.userId;
    return this.addressService.findAllUserAddresses(userId);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully', type: Address })
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.updateAddress(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  async deleteAddress(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.addressService.deleteAddress(id);
  }
}
