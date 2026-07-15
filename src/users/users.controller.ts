import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import type { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Estos son para cualquiera
  @Get('profile')
  @Auth()
  getProfile(@GetUser() user: User) {
    const { password: _, refreshToken: __, deletedAt: ___, ...userData } = user;
    return userData;
  }

  @Patch('profile')
  @Auth()
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('profile')
  @Auth()
  deleteProfile(@GetUser() user: User) {
    return this.usersService.softDelete(user.id);
  }
  // Esto solo del admin
  @Get()
  @Auth(ValidRoles.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.softDelete(id);
  }
}
