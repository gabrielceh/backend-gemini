import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { GeminiModule } from './gemini/gemini.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GeminiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
