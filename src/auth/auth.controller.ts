import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import type { Request, Response } from 'express';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, userData } =
      await this.authService.login(loginUserDto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      userData,
      access_token,
    };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refresh_token as string;

    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const data = await this.authService.refreshToken(token);

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: data.access_token,
    };
  }

  @Post('logout')
  @Auth()
  logout(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return this.authService.logout(user.id);
  }

  @Get('users')
  @Auth(ValidRoles.ADMIN)
  findAll() {
    return this.authService.findAll();
  }
}
