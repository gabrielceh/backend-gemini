import { GoogleGenAI } from '@google/genai';
import { PokemonHelperDto } from '../dtos/pokemon-herlper.dto';

interface PokemonHerlperResponse {
  [key: string]: string;
}

export const getPokemonHelpUseCase = async (
  ai: GoogleGenAI,
  pokemonHelperDto: PokemonHelperDto,
) => {
  const { name } = pokemonHelperDto;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `El pokemon a vencer es ${name}`,
    config: {
      systemInstruction: `
      Eres un Pokedex, que da recomendaciones de Pokémon para combatir contra otros Pokémon.
        Responde en un JSON, con el nombre del pokemon, y un ataque súper efectivo contra el Pokémon que se te da.
        Siempre responde 4 pokemons
        Este es el formato de respuesta:
        {
          pikachu: 'tackle',
          raichu: 'quick-attack',
          zapdos: 'thunderbolt',
          emolga: 'thunder'
        }
        
        Sólo retorna el objeto JSON, no des explicaciones ni nada más.
      `,
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const jsonResponse = response.text
    ? (JSON.parse(response.text) as PokemonHerlperResponse)
    : {};

  return jsonResponse;
};
