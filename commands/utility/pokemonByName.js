const { SlashCommandBuilder } = require('discord.js');
const fetchPokemonDataByName = require('../../functions/api-functions/fetchPokemonDataByName'); //Import function created before

module.exports = {
	data: new SlashCommandBuilder() //Create the slash command 
		.setName('pokemonname')
		.setDescription('Search a Pokemon and display basic information.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the Pokemon')
                .setRequired(true)),

	async execute(interaction) { //Receive the discord interaction
        let pokemon = interaction.options.getString('name'); //create variable that holds the pokemon name, we take this value from interaction.options.getString
        pokemon = pokemon.toLowerCase(); //make it lowercase so it doesn't have any issues when making the GET request

        const pokemonData = await fetchPokemonDataByName(pokemon); //send pokemon name
        const typeNames = pokemonData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
        const typesString = typeNames.join(', ');
        interaction.reply(`Pokedex ID: ${pokemonData.id} \nName: ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} \nType: ${typesString}`)
        .catch((error) =>{
            console.error('Error:', error);
            interaction.reply(`Can't find the Pokemon!`); //error in case it can't find the pokemon
        });
	},
};