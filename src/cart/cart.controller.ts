import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth, GetUser } from '../auth/decorators';
import type { User } from '@prisma/client';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Auth()
  getCart(@GetUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @Auth()
  addItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(user.id, createCartItemDto);
  }

  @Patch('items/:cartItemId')
  @Auth()
  updateItem(
    @GetUser() user: User,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
  ) {
    return this.cartService.updateItem(user.id, cartItemId, updateCartItemDto);
  }

  @Delete('items/:cartItemId')
  @Auth()
  removeItem(
    @GetUser() user: User,
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
  ) {
    return this.cartService.removeItem(user.id, cartItemId);
  }
}
