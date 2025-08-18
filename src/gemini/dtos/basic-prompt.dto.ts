import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// validamos la data
export class BasicPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsArray()
  @IsOptional()
  files: Express.Multer.File[];
}
