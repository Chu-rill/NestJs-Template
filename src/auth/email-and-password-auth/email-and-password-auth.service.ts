import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto, OTPDto, ResendDto, SignUpDto } from './dto/auth.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import {
  encrypt,
  comparePassword,
} from 'src/utils/helper-functions/encryption';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/infra/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userRespository: UserRepository,
    private jwt: JwtService,
    private otp: OtpService,
    private mailService: MailService,
  ) {}
  async signup(dto: SignUpDto) {
    //this is use to signup a new user nad based on the role of the user it makes them a customer,staff or admin
    let existingUser = await this.userRespository.findUserByEmail(dto.email);
    if (existingUser) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'email already exist',
        data: null,
      };
    }
    const hassedPassword = await encrypt(dto.password);
    const user = await this.userRespository.createUser(
      dto.username,
      dto.email,
      hassedPassword,
      dto.phone,
      dto.role,
    );

    const otp = await this.otp.generateOTP(user.email);

    const data = {
      subject: 'InnkeeperPro validation',
      username: user.username,
      OTP: otp,
    };

    await this.mailService.sendWelcomeEmail(user.email, data);
    // const login = await this.login({
    //   email: dto.email,
    //   password: dto.password,
    // });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'user signup',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      // token: login.token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRespository.findUserByEmail(dto.email);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user not found',
        data: null,
      };
    }
    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'invalid password',
        data: null,
      };
    }
    let { password: userPassword, ...userWithoutPassword } = user;
    const payload = {
      ...userWithoutPassword, // Spread the rest of the user properties
    };
    // const payload = {
    //   sub: user.id,
    //   username: user.firstName,
    // };
    const token = await this.jwt.signAsync(payload);
    return {
      statusCode: HttpStatus.OK,
      message: 'login successful',
      data: {
        id: user.id,
        username: user.username,
      },
      token: token,
    };
  }

  async validateOTP(dto: OTPDto) {
    const user = await this.userRespository.findUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate OTP
    await this.otp.verifyOTP(dto.email, dto.OTP);

    // Mark user as verified
    await this.userRespository.verifyUser(dto.email);

    return {
      statusCode: HttpStatus.OK,
      message: 'User verified successfully',
      data: null,
    };
  }

  async resendOTP(dto: ResendDto) {
    const user = await this.userRespository.findUserByEmail(dto.email);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user not found',
        data: null,
      };
    }

    const otp = await this.otp.generateOTP(user.email);

    const data = {
      subject: 'InnkeeperPro validation',
      username: user.username,
      OTP: otp,
    };

    await this.mailService.sendWelcomeEmail(user.email, data);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'OTP Send',
    };
  }
}
