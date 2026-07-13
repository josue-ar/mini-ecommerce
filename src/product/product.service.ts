import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        userId: user.id,
      },
    });
    return product;
  }

  async findAll(limit: number = 10, offset: number = 0) {
    return await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
    return updatedProduct;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: `Product with id ${id} has been deleted successfully.`,
    };
  }
}
