//Not actually related to api, just returns the link so it can be used elsewhere
function getPokemonImageURL(pokemonId){ //Function name
    //The image name is formatted as 001.jpg, so we add the remaining 0s and use that value for the link.
    imageName = String(pokemonId).padStart(3,0);
    imageUrl = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${imageName}.png`;
    return imageUrl; //Return url to be used in other files
} 
module.exports = getPokemonImageURL; //Exports to be used in another file