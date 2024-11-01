import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profie.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }
}
