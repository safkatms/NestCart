// src/users/dto/update-profile.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'URL of the user\'s profile picture',
    example: 'https://example.com/profile-picture.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
