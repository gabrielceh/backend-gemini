import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

import { ConfigService } from 'src/config/config.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { basicPromptStreamUseCase, basicPromptUseCase } from './use-cases';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.geminiApiKey,
    });
  }

  // TODO: mantenmer en memoria el historia

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }

  async chatStream(chatPromptDto: ChatPromptDto) {
    return chatPromptStreamUseCase(this.ai, chatPromptDto);
  }
}
