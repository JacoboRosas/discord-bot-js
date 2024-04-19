const { SlashCommandBuilder } = require('discord.js');
const fetchPokemonDataByName = require('../../api-functions/fetchPokemonDataByName'); //Import function created before

module.exports = {
	data: new SlashCommandBuilder() //Create the slash command 
		.setName('pokemon2')
		.setDescription('Gets the name of a Pokemon.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the Pokemon')
                .setRequired(true)),

	async execute(interaction) { //Receive the discord interaction
        let pokemon = interaction.options.getString('name'); //create variable that holds the pokemon name, we take this value from interaction.options.getString
        pokemon = pokemon.toLowerCase(); //make it lowercase so it doesn't have any issues when making the GET request
        
        //GET method by default when not specifying any other method
        //Returns a Promise, in this case, a json object which we will use to grab the data from
        fetchPokemonDataByName(pokemon) //send pokemon name
        .then(data => { //when using fetchPokemonDatByName, it returned a json object, we use this json object in the data variable
            const typeNames = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)); //access types from data object, types is an array with a type property
            //so we use map function to extract just the type property of the types array
            const typesString = typeNames.join(', '); //join the types, in case it has more than one
            interaction.reply(`Pokedex ID: ${data.id} \nName: ${data.name.charAt(0).toUpperCase() + data.name.slice(1)} \nType: ${typesString}`); //make the discord bot reply with the pokemon data
            console.log(data)
        })
        .catch((error) =>{
            console.error('Error:', error);
            interaction.reply(`Can't find the Pokemon!`); //error in case it can't find the pokemon
        });
	},
};