import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profie.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Retrieve all users with customer role', type: [User] })
  async getAllCustomers(): Promise<User[]> {
    return this.usersService.findAllCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch('ban/:userId')
  @ApiOperation({ summary: 'Ban a customer' })
  @ApiResponse({ status: 200, description: 'Customer banned successfully', type: User })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async banCustomer(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.banCustomer(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch('unban/:userId')
  @ApiOperation({ summary: 'Unban a customer' })
  @ApiResponse({ status: 200, description: 'Customer unbanned successfully', type: User })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async unbanCustomer(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.unbanCustomer(userId);
  }

}
