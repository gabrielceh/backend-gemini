import * as path from 'path';
import * as fs from 'node:fs';
import {
  // Content,
  ContentListUnion,
  createPartFromUri,
  GoogleGenAI,
  Modality,
} from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';
import { ImageGenerationDto } from '../dtos/image-generation.dto';

interface Options {
  model?: string;
  systemInstruction?: string[];
}

export interface ImageGenerationResponse {
  text: string;
  imageUrl: string;
}

const AI_IMAGES_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'public/ai-images',
);

// https://ai.google.dev/gemini-api/docs/text-generation?hl=es-419#multi-turn-conversations
export const ImageGenerationUseCase = async ({
  apiUrl,
  ai,
  imageGenerationDto,
  options,
}: {
  apiUrl: string;
  ai: GoogleGenAI;
  imageGenerationDto: ImageGenerationDto;
  options?: Options;
}): Promise<ImageGenerationResponse> => {
  const { files, prompt } = imageGenerationDto;

  const contents: ContentListUnion = [{ text: prompt }];
  const uploadedFiles = await geminiUploadFiles(ai, files, {
    transformToPng: true,
  });

  uploadedFiles.forEach((file) => {
    contents.push(createPartFromUri(file.uri ?? '', file.mimeType ?? ''));
  });

  const {
    model = 'gemini-2.0-flash-preview-image-generation',
    // systemInstruction = [],
  } = options ?? {};

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  let imageUrl = '';
  let text = '';
  const imageId = uuidv4();

  const content = response.candidates?.[0]?.content;

  for (const part of content?.parts || []) {
    if (part.text) {
      text = part.text;
      continue;
    }
    if (!part.inlineData) {
      continue;
    }
    const imageDate = part.inlineData.data!;
    const buffer = Buffer.from(imageDate, 'base64');
    const imagePath = path.join(AI_IMAGES_PATH, `${imageId}.png`);
    fs.writeFileSync(imagePath, buffer);
    imageUrl = `${apiUrl}/ai-images/${imageId}.png`;
  }

  return {
    text,
    imageUrl,
  };
};
