// src/address/address.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async createAddress(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({ ...createAddressDto, user: { id: userId } });
    return this.addressRepository.save(address);
  }

  async updateAddress(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    await this.addressRepository.update(id, updateAddressDto);
    const updatedAddress = await this.addressRepository.findOneBy({ id });
    if (!updatedAddress) {
      throw new NotFoundException('Address not found');
    }
    return updatedAddress;
  }

  async deleteAddress(id: number): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }

  async findAllUserAddresses(userId: number): Promise<Address[]> {
    return this.addressRepository.find({ where: { user: { id: userId } } });
  }
}
