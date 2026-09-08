import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, AuthModule, CloudinaryModule],
})
export class ProductModule {}
