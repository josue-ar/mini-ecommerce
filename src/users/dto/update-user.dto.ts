import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
