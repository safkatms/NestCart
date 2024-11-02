import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profie.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  // Registration
  async register(registerDto: RegisterDto): Promise<User> {
    // Check if the passwords match
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if the email already exists
    const existingUser = await this.findByEmail(registerDto.email)

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create and save the new user
    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }



  // Find user by Google ID
  async findByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  // Create a new user from Google profile
  async createUserFromGoogle(userData: { googleId: string; email: string; name: string; profilePicture: string }): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // Find user by Email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //Find user by Id
  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }


  // Get user profile by ID
  async getProfile(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user profile
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.getProfile(id);

    // Check if the new email already exists and belongs to a different user
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateProfileDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already in use by another user');
      }
    }

    // Update user data
    Object.assign(user, updateProfileDto);

    return this.usersRepository.save(user);
  }


  //Update Password
  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.usersRepository.update({ email }, { password: newPassword });
  }
}
