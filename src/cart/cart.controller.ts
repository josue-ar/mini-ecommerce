import { Body, Controller, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth, GetUser } from '../auth/decorators';
import type { User } from '@prisma/client';
import { CreateCartItemDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth()
  getCart(@GetUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Post()
  @Auth()
  addItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(user.id, createCartItemDto);
  }
}
