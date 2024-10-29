import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';  // Use UsersService here

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {  // Inject UsersService
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName, photos } = profile;

    // User data to be stored in the database
    const userData = {
      googleId: id,
      email: emails[0].value,
      name: displayName,
      profilePicture: photos[0]?.value,
    };

    // Use UsersService to find or create the user in the database
    const user = await this.usersService.findOrCreateUser(userData);
    done(null, user);
  }
}
