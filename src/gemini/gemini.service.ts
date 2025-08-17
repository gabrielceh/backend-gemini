import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

import { ConfigService } from 'src/config/config.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { basicPromptStreamUseCase, basicPromptUseCase } from './use-cases';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.geminiApiKey,
    });
  }

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }
}
