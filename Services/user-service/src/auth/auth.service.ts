import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { PasswordReset } from './entities/passwordReset.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { UsersService } from 'src/users/users.service'; // Import your UserService for user management
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async generateJwtToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<string> {
    const { email } = sendOtpDto;

    // Check if the user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for recent OTP request
    const lastRequest = await this.passwordResetRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' } // Assuming createdAt is the timestamp for OTP creation
    });

    if (lastRequest) {
      // Check if the last request was within 1 minute
      const timeDifference = new Date().getTime() - lastRequest.createdAt.getTime();
      if (timeDifference < 60000) { // 1 minute in milliseconds
          throw new BadRequestException('OTP can only be sent once per minute');
      }
  }

    // Generate OTP and expiration time
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a simple OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP valid for 15 minutes

    // Save OTP in the database
    const passwordReset = this.passwordResetRepository.create({
      email,
      resetToken: otp,
      expiresAt,
    });

    await this.passwordResetRepository.save(passwordReset);

    // Send OTP via email or SMS (Implement your own email service)
    // await this.emailService.sendOtp(email, otp); // Un-comment this line if using an email service

    return 'OTP sent successfully';
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const { email, otp } = verifyOtpDto;

    const resetRequest = await this.passwordResetRepository.findOne({ where: { email, resetToken: otp } });

    if (!resetRequest || resetRequest.isUsed || resetRequest.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark the OTP as used
    resetRequest.isUsed = true;
    await this.passwordResetRepository.save(resetRequest);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, otp, newPassword, confirmPassword } = resetPasswordDto;

    const resetRequest = await this.passwordResetRepository.findOne({
      where: { email, resetToken: otp, isUsed: true }
    });

    if (!resetRequest) {
      throw new BadRequestException('OTP verification required before resetting password');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);

    await this.passwordResetRepository.delete({ email });

    return 'Password has been reset successfully';
  }
}
