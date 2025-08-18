import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import type { Response } from 'express';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

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
    basicPromptDto.files = files;

    const stream = await this.geminiService.basicPromptStream(basicPromptDto);

    res.setHeader('Content-Type', 'text/event-stream');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      res.write(piece);
    }

    res.end();
  }
}
