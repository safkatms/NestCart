import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,  // Directly using TypeORM Repository
    private jwtService: JwtService,
  ) {}

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


  //Login
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Invalid credentials');
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

  //Update Password
  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.usersRepository.update({ email }, { password: newPassword });
  }
}
