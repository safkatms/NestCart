// otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SendOtpDto {
    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    @IsEmail()
    email: string;
}

export class VerifyOtpDto {
    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The OTP sent to the user', example: '123456' })
    @IsNotEmpty()
    @IsString()
    otp: string;
}

export class ResetPasswordDto {

    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The OTP sent to the user', example: '123456' })
    @IsNotEmpty()
    @IsString()
    otp: string;

    @ApiProperty({ description: 'The new password of the user', example: 'strongpassword' })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    newPassword: string;

    @ApiProperty({ description: 'Confirm new password', example: 'strongpassword' })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    confirmPassword: string;
}
