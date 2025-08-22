import { GoogleGenAI } from '@google/genai';
import { PokemonHelperDto } from '../dtos/pokemon-herlper.dto';

export interface PokemonHerlperResponse {
  pokemonSelected: string;
  pokedexNumber: number;
  pokemonList: Pokemon[];
}

export interface Pokemon {
  name: string;
  attack: Attack;
  pokedexNumber: number;
  tipes: string[];
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
        Siempre responde 4 pokemons, con el ataque , número de la pokedex nacional oficial y los tipos del pokémon.
        Ten en cuenta esto:
          * El ataque tanto en español como en inglés (solo nombres oficiales de los ataques, no inventes nombres de ataques).
          * Los ataques deben ser superfecetios contra los tipos del pokémon dado, no valen ataques neutros o no efectivos.
          * El número de la pokedex nacional oficial segun los videojuegos de pokémon.
          * Los tipos del pokémon oficiales de los videojuegos.
          * Intenta añadir pokémon de varias generaciones, distintas formas, como las alola, galar, megaevoluciones, etc.
          * No te inventes formas, por ejemplo, no exiten los pokémon forma teselia.
          * Si el pokémon seleccionado no existe, responde con el nombre del pokémon seleccionado y el pokemonList vacio, pokedexNumber: -1.
          * Este es el formato de respuesta: 
        {
          "pokemonSelected":"nombre del pokemon a vencer",
          "pokedexNumber": número de la pokedex nacional oficial,
          "pokemonList":[
            {
              "name": "pikachu",
              "attack": [
                "es": "placaje",
                "en": "tackle"
              ],
              types: ["electric"]
              pokedexNumber: 25,
            },
            {
              "name": "raichu",
              "attack": [
                "es": "ataque rápido",
                "en": "quick-attack"
              ],
              types: ["electric"],
              pokedexNumber: 26,
            },
            {
              "name": "zapdos",
              "attack": [
                "es": "rayo",
                "en": "thunderbolt"
              ],
              types: ["electric", "flying"],
              pokedexNumber: 145,
            },
            {
              "name": "emolga",
              "attack": [
                "es": "trueno",
                "en": "thunder"
              ],
              types: ["electric", "flying"],
              pokedexNumber: 587,
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
