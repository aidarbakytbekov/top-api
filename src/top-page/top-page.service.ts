import { TopPageModel, TopLevelCategory } from './top-page.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel)
		private readonly topPageModel: ModelType<TopPageModel>
	) {}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}
	async findById(id: string) {
		const page = await this.topPageModel.findById(id).exec();

		if (!page) return new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

		return page;
	}

	async findByAlias(alias: string) {
		const foundAlias = await this.topPageModel.findOne({ alias }).exec();

		if (!foundAlias) return new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

		return foundAlias;
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		const page = await this.topPageModel
			.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
			.exec();

		if (!page) return new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

		return page;
	}

	async deleteById(id: string) {
		const deletedPage = await this.topPageModel.findByIdAndDelete(id).exec();

		if (!deletedPage) return new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

		return deletedPage;
	}
	async updateById(id: string, dto: CreateTopPageDto) {
		const updatedPage = await this.topPageModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();

		if (!updatedPage) return new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

		return updatedPage;
	}
}
