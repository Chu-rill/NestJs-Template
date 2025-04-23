import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class OauthService {
  constructor(
    private jwt: JwtService,
    private userRepository: UserRepository,
  ) {}

  async validateOAuthGoogleLogin(req): Promise<any> {
    if (!req || !req.user) {
      console.log('Google login failed:', req);
      throw new UnauthorizedException('No user from Google');
    }

    const auth = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      picture: req.user.picture,
    };

    let user = await this.userRepository.findUserByEmail(auth.email);

    if (!user) {
      user = await this.userRepository.createUserOauth(
        auth.firstName,
        auth.lastName,
        auth.email,
        auth.picture,
      );

      await this.userRepository.verifyUser(user.email);
    }

    const payload = { id: user.id, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'Google Auth Successful',
      data: user,
      token: token,
    };
  }
}
