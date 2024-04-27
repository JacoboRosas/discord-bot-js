async function fetchPokemonType(type){ //Receive the pokemon name 
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const typeData = await response.json();
    return typeData       
} 
module.exports = fetchPokemonType;