import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Confirm password', example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
