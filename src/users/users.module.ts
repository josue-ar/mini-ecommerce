import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, AuthModule, CloudinaryModule],
  exports: [UsersService],
})
export class UsersModule {}
