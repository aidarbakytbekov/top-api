import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { HhService } from './hh.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	providers: [HhService],
	imports: [ConfigModule, HttpModule],
  exports: [HhService]
})
export class HhModule {}
