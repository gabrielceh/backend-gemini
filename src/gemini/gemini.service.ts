import { Injectable } from '@nestjs/common';
import { Content, GoogleGenAI } from '@google/genai';

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
  // ! mantenmer en memoria el historial para agilidad del curso
  private chatHistory = new Map<string, Content[]>();

  async basicPrompt(basicPromptDto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, basicPromptDto);
  }

  async basicPromptStream(basicPromptDto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, basicPromptDto);
  }

  async chatStream(chatPromptDto: ChatPromptDto) {
    const chatHistory = this.getChatHistory(chatPromptDto.chatId);
    return chatPromptStreamUseCase(this.ai, chatPromptDto, {
      history: chatHistory,
    });
  }

  saveMessage(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);
    messages.push(message);
    this.chatHistory.set(chatId, messages);
    console.log(this.chatHistory);
  }

  getChatHistory(chatId: string) {
    // clonamos el historial para que no se modifique
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }
}
