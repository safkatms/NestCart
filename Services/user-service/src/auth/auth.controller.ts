import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth2 login' })
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth2 redirect handler' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  googleAuthRedirect(@Req() req) {
    return {
      message: 'User authenticated successfully',
      user: req.user,
    };
  }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOtp(verifyOtpDto);
    return { message: 'OTP verified successfully' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
