import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
  Param,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthenticationGuard } from './authentication.guard';
import { User } from '../schemas/user.schema';
import { ResendVerificationDto } from '../dto/ResendVerification.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  async getHello(@Headers('authorization') token: string) {
    console.log('token', token);
    return await this.authenticationService.getHello();
  }

  @Post('/signup')
  async signUp(
    @Headers('authorization') token: string,
    @Body()
    signUpDto: SignUpDto,
  ): Promise<{ user: User; token: string }> {
    console.log('token', token);
    return await this.authenticationService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: any,
    @Headers('authorization') authToken: string, // Rename this to authToken
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    console.log('token', authToken); // Use authToken here
    // Cookies.set('token', authToken);
    const result = await this.authenticationService.login(loginDto);
    if ('user' in result) {
      res.cookie('token', authToken, { httpOnly: true });
      return { user: result.user };
    } else {
      // Handle the case where the result has a message property
      return { message: result.message };
    }
  }
  @Get('/verify/:token')
  async verifyEmail(@Param('token') token: string): Promise<any> {
    return await this.authenticationService.verifyEmail(token);
  }

  @Get('/forgot-password/:email')
  async sendForgotPassword(
    @Headers('authorization') token: string,
    @Param('email') email: string,
  ): Promise<string> {
    console.log('token', token);
    try {
      const isEmailSent =
        await this.authenticationService.sendForgotPassword(email);
      if (isEmailSent) {
        return 'Email sent successfully';
      } else {
        return 'Email not sent';
      }
    } catch (error) {
      console.log('error', error);
      return 'Email not sent';
    }
  }

  @Post('/reset-password')
  async resetPassword(
    @Headers('authorization')
    @Body('token')
    token: string,
    @Body('password') password: string,
  ): Promise<string> {
    console.log('token', token);
    try {
      const isPasswordReset = await this.authenticationService.resetPassword(
        token,
        password,
      );
      if (isPasswordReset) {
        return 'Password reset successfully';
      } else {
        return 'Password not reset';
      }
    } catch (error) {
      console.log('error', error);
      return 'Password not reset';
    }
  }

  @Post('/resend-verification')
  async resendVerificationEmail(
    @Body() resendVerificationDto: ResendVerificationDto,
  ): Promise<any> {
    return await this.authenticationService.resendVerificationEmail(
      resendVerificationDto.email,
    );
  }
  @Get('/user/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.authenticationService.getUserByEmail(email);
  }
}
