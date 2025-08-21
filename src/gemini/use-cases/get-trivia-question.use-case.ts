import { GoogleGenAI } from '@google/genai';
import { TriviaQuestionDto } from '../dtos/trivia-question.dto';

export interface TriviaQuestionResponse {
  question: string;
  answers: string[];
  correct: number;
}

export const getTriviaQuestionUseCase = async (
  ai: GoogleGenAI,
  triviaQuestionDto: TriviaQuestionDto,
) => {
  const { topic } = triviaQuestionDto;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Dame una pregunta de conocimiento general sobre ${topic}`,
    config: {
      systemInstruction: `
     Eres un generador de trivias, se te pedirán preguntas de conocimiento general
      y debes de generar 3 respuestas incorrectas y una correcta
      El indice debe de variar de posición, de vez en cuando genera una pregunta súper complicada de responder
        
       {
        question: "aquí es donde va la pregunta general"
         answers: [
          "answer 1",
          "answer 2",
          "answer 3",
          "answer 4",
         ],
         correct: indice del arreglo
       }
        
        Sólo retorna el objeto JSON, no des explicaciones ni nada más.
      `,
      // la respuesta no deberiamos enviarla, podriamos almacenar la pregunta en una base de datos, sus opciones y respuiesta
      // crear otro endpoint para obtener la respuesta de la pregunta
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const jsonResponse = response.text
    ? (JSON.parse(response.text) as TriviaQuestionResponse)
    : {};

  return jsonResponse;
};
