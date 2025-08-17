import { Module } from '@nestjs/common';
import { GeminiModule } from './gemini/gemini.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, GeminiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
