import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart;
  }

  async addItem(userId: string, createCartItemDto: CreateCartItemDto) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: createCartItemDto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (createCartItemDto.quantity > product.stock) {
      throw new BadRequestException(`Quantity exceeds available stock`);
    }

    let cart = await this.prismaService.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: {
          userId,
        },
      });
    }

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: createCartItemDto.productId,
        },
      },
    });

    if (!cartItem) {
      await this.prismaService.cartItem.create({
        data: {
          quantity: createCartItemDto.quantity,
          cartId: cart.id,
          productId: createCartItemDto.productId,
        },
      });
    } else {
      const newQuantity = cartItem.quantity + createCartItemDto.quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException(`Quantity exceeds available stock`);
      }

      await this.prismaService.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    }

    return this.getCart(userId);
  }
}
