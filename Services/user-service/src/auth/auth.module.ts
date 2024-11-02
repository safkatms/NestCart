// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/passwordReset.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([PasswordReset,User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy], // Add JwtStrategy here
  exports: [AuthService, JwtStrategy], // Export JwtStrategy if other modules need it
})
export class AuthModule { }
