import { createPartFromUri, GoogleGenAI } from '@google/genai';
import { ChatPromptDto } from '../dtos/chat-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';

interface Options {
  model?: string;
  systemInstruction?: string[];
}
// https://ai.google.dev/gemini-api/docs/text-generation?hl=es-419#multi-turn-conversations
export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { files, prompt } = chatPromptDto;

  const uploadedFiles = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.5-flash',
    systemInstruction = [
      'Responde en español',
      'Utiliza markdown',
      'Usa el sistema métrico decimal',
    ],
  } = options ?? {};

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: {
        thinkingBudget: -1,
      },
    },
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hola' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Hola ¿qué tal?' }],
      },
    ],
  });

  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? ''),
      ),
    ],
  });
};
