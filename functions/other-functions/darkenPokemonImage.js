//This one is a bit more tricky, and requires both sharp and axios libraries
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');

//Not actually related to api, just returns the link so it can be used elsewhere
async function darkenPokemonImage(pokemonId){ //Function name
    //The image name is formatted as 001.jpg, so we add the remaining 0s and use that value for the link.
    imageName = String(pokemonId).padStart(3,0);
    imageUrl = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${imageName}.png`; 
    
    //Download the image so it can be darkened
    let response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer'
    });

    let darkenedImageBuffer = await sharp(Buffer.from(response.data))
        .linear(0,0)
        .toBuffer();
    
    //Write the darkened image to a file
    let filename =`./images/${imageName}_dark.png`;
    fs.writeFileSync(filename, darkenedImageBuffer);
    return filename;
} 
module.exports = darkenPokemonImage; //Exports to be used in another file