import { GoogleGenAI } from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
  model?: string;
  systemInstruction?: string[];
}

export const basicPromptUseCase = async (
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

  const response = await ai.models.generateContent({
    model: model,
    contents: basicPromptDto.prompt,
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: {
        // hacemos que el modelo razone
        // si es 0, no pensará, por defecto está activavo
        // -1 para pensamiento dinamico, es decir segun la complejidad de la pregunta
        thinkingBudget: 0,
      },
    },
  });

  return response.text;
};
