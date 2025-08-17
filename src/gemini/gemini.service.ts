import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';

@Injectable()
export class GeminiService {
  constructor(private readonly configService: ConfigService) {}

  basicPrompt(basicPromptDto: BasicPromptDto) {
    console.log(basicPromptDto);
    return basicPromptDto;
  }
}
