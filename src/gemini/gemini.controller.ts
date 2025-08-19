import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import type { Response } from 'express';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { Content, GenerateContentResponse } from '@google/genai';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  // @Post('basic-prompt-stream')
  // async basicPromptStream(
  //   @Body() basicPromptDto: BasicPromptDto,
  //   @Res() res: Response,
  //   // TODO: files
  // ) {
  //   const stream = await this.geminiService.basicPromptStream(basicPromptDto);

  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.status(HttpStatus.OK);

  //   for await (const chunk of stream) {
  //     const piece = chunk.text;
  //     res.write(piece);
  //   }

  //   res.end();
  // }

  // https://docs.nestjs.com/techniques/file-upload
  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files')) // file para un archivo, files para varios
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // conectamos el dto con los files
    basicPromptDto.files = files || [];

    const stream = await this.geminiService.basicPromptStream(basicPromptDto);

    void this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files')) // file para un archivo, files para varios
  async chatStream(
    @Body() chatPromptDtop: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // conectamos el dto con los files
    chatPromptDtop.files = files || [];

    const stream = await this.geminiService.chatStream(chatPromptDtop);
    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage: Content = {
      role: 'model',
      parts: [{ text: data }],
    };

    const userMessage: Content = {
      role: 'user',
      parts: [
        {
          text: chatPromptDtop.prompt,
          // podriamos almacenar url de imagenes para que el usuario pueda verlas, videos, etc
        },
      ],
    };

    this.geminiService.saveMessage(chatPromptDtop.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDtop.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      text: message.parts?.map((part) => part.text).join(''), // solo almacenamos texto
    }));
  }
}
