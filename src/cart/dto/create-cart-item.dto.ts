import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
