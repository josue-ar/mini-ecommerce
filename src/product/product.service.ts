import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    user: User,
  ) {
    const image = await this.cloudinaryService.uploadImage(file);
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        userId: user.id,
        imagePublicId: image.public_id,
        imageUrl: image.secure_url,
      },
    });
    return product;
  }

  async findAll(limit: number = 10, offset: number = 0) {
    return await this.prisma.product.findMany({
      where: {
        user: {
          status: 'ACTIVE',
        },
      },
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
