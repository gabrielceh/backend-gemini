import { GoogleGenAI } from '@google/genai';
import { PokemonHelperDto } from '../dtos/pokemon-herlper.dto';

export interface PokemonHerlperResponse {
  pokemonSelected: string;
  pokemonList: Pokemon[];
}

export interface Pokemon {
  name: string;
  attack: Attack;
}

export interface Attack {
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
        Siempre responde 4 pokemons, con el ataque tanto en español como en inglés (solo nombres oficiales, no inventes nombres de ataques).
        Si el pokemon seleccionado no existe, responde con el nombre del pokemon seleccionado y el pokemonList vacio. 
        Este es el formato de respuesta:
        
        {
          "pokemonSelected":"nombre del pokemon a vencer",
          "pokemonList":[
            {
              "name": "pikachu",
              "attack": [
                "es": "placaje",
                "en": "tackle"
              ]
            },
            {
              "name": "raichu",
              "attack": [
                "es": "ataque rápido",
                "en": "quick-attack"
              ]
            },
            {
              "name": "zapdos",
              "attack": [
                "es": "rayo",
                "en": "thunderbolt"
              ]
            },
            {
              "name": "emolga",
              "attack": [
                "es": "trueno",
                "en": "thunder"
              ]
            }
          ]
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
