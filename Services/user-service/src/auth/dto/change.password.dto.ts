// change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: 'Current password of the user' })
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ description: 'New password for the user', example: 'newStrongPassword' })
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;

    @ApiProperty({ description: 'Confirm new password', example: 'newStrongPassword' })
    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
}
