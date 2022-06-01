import { HhResponse } from './hh.model';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { API_URL } from './hh.constants';
import { HhData } from '../top-page/top-page.model';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HhService {
	private token: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService
	) {
		this.token = this.configService.get('HH_TOKEN') ?? '';
	}

	async getData(text: string) {
		try {
			const { data } = await firstValueFrom(this.httpService
				.get<HhResponse>(API_URL.vacancies, {
					params: {
						text,
						clusters: true,
					},
					headers: {
						'User-Agent': 'OwlTop/1.0 (aidarionov@gmail.com)',
						Authorization: `Bearer ${this.token}`,
					},
				}))
        return this.parseData(data)
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HhResponse): HhData {
		const salaryCluster = data.clusters.find((c) => c.id === 'salary');
		if (!salaryCluster) {
			throw new Error('Не найден кластер');
		}
		const juniorSalary = this.getSalaryFromString(
			salaryCluster.items[1].name
		);
		const middleSalary = this.getSalaryFromString(
			salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name
		);
		const seniorSalary = this.getSalaryFromString(
			salaryCluster.items[salaryCluster.items.length - 1].name
		);

		return {
			count: data.found,
			juniorSalary,   
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(salary: string): number {
		const numberRegExp = /(\d+)/g;
		const res = salary.match(numberRegExp);
		if (!res) {
			return 0;
		}
		return Number(res[0]);
	}
}
