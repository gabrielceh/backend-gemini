import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class GeminiService {
  constructor(private readonly configService: ConfigService) {}

  basicPrompt() {
    return { hello: 'Hello from Gemini!' };
  }
}
