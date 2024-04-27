async function fetchPokemonCount(){ //Function name
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/`);
    const pokemonCount = await response.json()
    return pokemonCount;
} 
module.exports = fetchPokemonCount; //Exports to be used in another file