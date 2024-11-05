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
import { ChangePasswordDto } from './dto/change.password.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async generateJwtToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
  //Login
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const payload = { email: user.email, sub: user.id, role: user.userType };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new BadRequestException('Invalid credentials');
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


  //Change Password
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<string> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Find user by ID
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If the user does not have a local password
    if (!user.password) {
      // Hash and set the new password directly
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(user.email, hashedNewPassword);
      return 'Password has been set successfully';
    }

    // Verify current password for users with a local password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash and update the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.email, hashedNewPassword);

    return 'Password changed successfully';
  }

}
