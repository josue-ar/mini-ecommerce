import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    let photoData = {};

    if (file) {
      const photo = await this.cloudinaryService.uploadImage(file);
      photoData = {
        photoPublicId: photo.public_id,
        photoUrl: photo.secure_url,
      };
    }

    const { password, ...restUser } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...restUser,
        ...(password && {
          password: await bcrypt.hash(password, 10),
        }),
        ...photoData,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photoUrl: true,
        photoPublicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (file && user.photoPublicId) {
      await this.cloudinaryService.deleteImage(user.photoPublicId);
    }

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
