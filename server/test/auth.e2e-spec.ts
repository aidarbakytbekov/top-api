import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { INVALID_PASSWORD, USER_NOT_FOUND } from '../src/auth/auth.constants';


const loginDto:AuthDto = {
  email: 'aidar@mail.com',
  password: 'claymore'
} 

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
  let token: string

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});
	it('/auth/login (POST) - fail password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, password: 'notclaymore'})
			.expect(401, {
				statusCode: 401,
				message: INVALID_PASSWORD,
				error: "Unauthorized"
			})
	});
	it('/auth/login (POST) - fail email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, email: 'hello@yandex.ru'})
			.expect(401, {
				statusCode: 401,
				message: USER_NOT_FOUND,
				error: "Unauthorized"
			}) 
	});

	afterAll(() => {
		disconnect();
	});
});
