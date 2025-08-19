import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';

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

  const uploadedFiles = await geminiUploadFiles(ai, files);

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
        ...uploadedFiles.map((image) =>
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
        // thinkingBudget: -1,
      },
    },
  });

  return response;
};
