import { UserModel } from './user.model';
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash, compare } from 'bcryptjs';
import {
	ALREADY_IN_SYSTEM_ERROR,
	USER_NOT_FOUND,
	INVALID_PASSWORD,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);

		const oldUser = await this.userModel.findOne({ email: dto.email });
		if (oldUser) {
			throw new BadRequestException(ALREADY_IN_SYSTEM_ERROR);
		}

		const newUser = new this.userModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		});

		const user = await newUser.save();
		const tokens = await this.issueTokenPair(String(user._id));

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async login(dto: AuthDto) {
		const user = await this.userModel.findOne({ email: dto.email }).exec();
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}

		const isValidPassword = await compare(dto.password, user.password);
		if (!isValidPassword) {
			throw new UnauthorizedException(INVALID_PASSWORD);
		}

		const tokens = await this.issueTokenPair(String(user._id));

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}
	async issueTokenPair(userId: string) {const data = { _id: userId };

		const refresh_token = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		});
		const access_token = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		});

		return { refresh_token, access_token };
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
		};
	}
}
