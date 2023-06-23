import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	Patch,
	HttpCode,
	UsePipes,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ValidationPipe, UseGuards } from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('products')
export class ProductController {
	 
	constructor(private readonly productService: ProductService){}

	@UseGuards(JwtAuthGeuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findById(@Param('id', IdValidationPipe) id: string) {
		return this.productService.findById(id)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteById(@Param('id', IdValidationPipe) id: string) {return this.productService.delete(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) {
        return this.productService.updateById(id, dto) }

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productService.findWithReviews(dto)
	}
}
