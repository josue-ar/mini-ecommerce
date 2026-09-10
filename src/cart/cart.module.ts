import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [AuthModule, PrismaModule],
})
export class CartModule {}
