import { GoogleGenAI } from '@google/genai';
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
    contents: basicPromptDto.prompt,
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
