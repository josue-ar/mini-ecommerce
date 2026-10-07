import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [PrismaModule, AuthModule],
})
export class OrdersModule {}
