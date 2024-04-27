async function fetchPokemonDataByName(pokemon){ //Receive the pokemon name 
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const pokemonData = await response.json();
    return pokemonData;
} 
module.exports = fetchPokemonDataByName; //Exports to be used in another file