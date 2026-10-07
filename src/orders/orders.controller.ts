import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from 'src/auth/decorators';
import type { User } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  createOrder(@GetUser() user: User) {
    return this.ordersService.createOrder(user.id);
  }

  @Get()
  @Auth()
  getOrder(@GetUser() user: User) {
    return this.ordersService.getOrder(user.id);
  }

  @Get(':id')
  @Auth()
  getOrderById(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    return this.ordersService.getOrderById(user.id, orderId);
  }
}
