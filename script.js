const BASE_URL = "https://pokeapi.co/api/v2";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const cardEl = document.getElementById("pokemon-card");

async function getPokemon(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

  if (!response.ok) {
    return {
      error:
        response.status === 404
          ? `No Pokémon found for "${nameOrId}" (404). Try a name like pikachu or an ID like 25.`
          : `The request failed with status ${response.status}. Please try again.`,
    };
  }

  const data = await response.json();

  return {
    pokemon: {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      sprites: {
        front_default: data.sprites.front_default,
      },
      types: data.types.map(({ slot, type }) => ({
        slot,
        type: { name: type.name },
      })),
      abilities: data.abilities.map(({ ability }) => ({
        ability: { name: ability.name },
      })),
      stats: data.stats.map(({ base_stat, stat }) => ({
        base_stat,
        stat: { name: stat.name },
      })),
    },
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameOrId = input.value.trim().toLowerCase();
  if (!nameOrId) return;

  statusEl.textContent = "Searching...";
  cardEl.replaceChildren();

  const result = await getPokemon(nameOrId);

  if (result.error) {
    statusEl.textContent = result.error;
    return;
  }

  const pokemon = result.pokemon;
  const pokemonCard = document.createElement("article");
  pokemonCard.className = "pokemon-result-card";

  const name = document.createElement("h2");
  name.textContent = pokemon.name;

  const imageUrl = pokemon.sprites.front_default;
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = pokemon.name;
    pokemonCard.append(image);
  }

  const details = document.createElement("p");
  details.textContent = `Height: ${pokemon.height / 10} m · Weight: ${pokemon.weight / 10} kg`;

  const types = document.createElement("p");
  types.textContent = `Types: ${pokemon.types.map(({ type }) => type.name).join(", ")}`;

  const abilities = document.createElement("p");
  abilities.textContent = `Abilities: ${pokemon.abilities.map(({ ability }) => ability.name).join(", ")}`;

  const stats = document.createElement("p");
  stats.textContent = `Stats: ${pokemon.stats.map(({ base_stat, stat }) => `${stat.name}: ${base_stat}`).join(", ")}`;

  pokemonCard.append(name, details, types, abilities, stats);
  cardEl.append(pokemonCard);
  statusEl.textContent = `Pokédex #${pokemon.id}`;
});
