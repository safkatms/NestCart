import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName, photos } = profile;

    try {
      let user = await this.usersService.findByGoogleId(id);

      if (!user) {
        user = await this.usersService.createUserFromGoogle({
          googleId: id,
          email: emails[0].value,
          name: displayName,
          profilePicture: photos[0]?.value,
        });
      }

      done(null, user);
    } catch (error) {
      done(error, false); // Handle errors gracefully
    }
  }
}
