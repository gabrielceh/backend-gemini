import { IsNotEmpty, IsString } from 'class-validator';

// validamos la data
export class BasicPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
