const fetchPokemonCount = require("./fetchPokedexCount");
const fetchPokemonDataByName = require("./fetchPokemonDataByName");

async function fetchRandomPokemon(){ //Receive the pokemon name 
    const pokemonCount = await fetchPokemonCount();
    let randomId = Math.floor(Math.random() * pokemonCount.count)+1;
    const pokemonResponse = await fetchPokemonDataByName(randomId);
    return pokemonResponse;
} 

module.exports = fetchRandomPokemon; //Exports to be used in another file