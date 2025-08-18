/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
  model?: string;
  systemInstruction?: string[];
}

export const basicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { files, prompt } = basicPromptDto;

  const images = await Promise.all(
    files.map(async (file) => {
      return await ai.files.upload({
        file: new Blob([new Uint8Array(file.buffer)], {
          type: file.mimetype?.includes('image') ? file.mimetype : 'image/jpg',
        }),
      });
    }),
  );

  const {
    model = 'gemini-2.5-flash',
    systemInstruction = [
      'Responde en español',
      'Utiliza markdown',
      'Usa el sistema métrico decimal',
    ],
  } = options ?? {};

  // https://ai.google.dev/api/generate-content?hl=es-419#method:-models.streamgeneratecontent
  const response = await ai.models.generateContentStream({
    model: model,
    // contents: basicPromptDto.prompt,
    contents: [
      createUserContent([
        prompt,
        // imagenes o archivos
        ...images.map((image) =>
          createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
        ),
      ]),
    ],
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: {
        // hacemos que el modelo razone
        // si es 0, no pensará, por defecto está activavo
        // -1 para pensamiento dinamico, es decir segun la complejidad de la pregunta
        thinkingBudget: -1,
      },
    },
  });

  return response;
};
