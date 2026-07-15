import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        status: UserStatus.ACTIVE,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, refreshToken, deletedAt, ...userData } = user;

    return userData;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const { password, ...restUser } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...restUser,
        ...(password && {
          password: await bcrypt.hash(password, 10),
        }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  }

  async softDelete(id: string) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
      },
    });

    return { message: `User with ID ${id} has been deleted` };
  }
}
