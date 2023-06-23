import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { HhService } from '../hh/hh.service';
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

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.topPageService.findById(id);
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		return this.topPageService.findByAlias(alias);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.topPageService.deleteById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: TopPageModel
	) {
		return this.topPageService.updateById(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}
	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
	@Post('test')
	async test() {
		const data = await this.topPageService.findForHhUpdate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData;
			await this.topPageService.updateById(page._id, page);
		}
	}
}
