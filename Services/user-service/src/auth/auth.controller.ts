import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth2 login' })
  async googleAuth(@Req() req) { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth2 redirect handler' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  async googleAuthRedirect(@Req() req) {
    const token = await this.authService.generateJwtToken(req.user);
    return {
      message: 'User authenticated successfully',
      user: req.user,
      token, // Return the JWT token
    };
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to user email' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOtp(verifyOtpDto);
    return { message: 'OTP verified successfully' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully' })
  @ApiResponse({ status: 400, description: 'OTP verification required or passwords do not match' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch('change-password')
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto): Promise<string> {
    const userId = req.user.userId;
    return this.authService.changePassword(userId, changePasswordDto);
  }
}
