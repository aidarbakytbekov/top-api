import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';
export const getMongoConfig = async (
	configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
		uri: 'mongodb://127.0.0.1:27017/top-api',
		...getMongoOptions(),
});

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	configService.get('MONGO_LOGIN') +
	':' +
	configService.get('MONGO_PASSWORD') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTHDATABASE');

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
