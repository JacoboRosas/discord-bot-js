function fetchPokemonDataByName(pokemon){ //Receive the pokemon name 
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`) //By default, a GET method
    .then(response=>{ //Holds the first Promise on the response variable
        if(!response.ok){ //If there is an error, then prints an error
            console.log("There has been an error!");
        }
        return response.json(); //Otherwise, returns the body of the first promise as json as the second promise
    })
    .catch((error)=>{ //.catch in case there's any error
        console.error('Error:',error);
    });
} 
module.exports = fetchPokemonDataByName; //Exports to be used in another file