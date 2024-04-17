const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Gets the name of a Pokemon.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the Pokemon')
                .setRequired(true)),

	async execute(interaction) {
        let Pokedex;
        let P;

        const module = await import('pokedex-promise-v2');
        Pokedex = module.default || module;
        P = new Pokedex();

        let pokemon = interaction.options.getString('name');
        pokemon = pokemon.toLowerCase();
        
        //GET request to the PokeAPI, made when the getPokemonByName method of the Pokedex instance P is called
        //Returns a Promise
        P.getPokemonByName(pokemon)
            //If Promise is resolved
            .then(function(response){
                console.log(response);
                const typeNames = response.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
                const typesString = typeNames.join(', ');
                interaction.reply(`Pokedex ID: ${response.id} \nName: ${response.name.charAt(0).toUpperCase() + response.name.slice(1)} \nType: ${typesString}`);
            })
            //Error catch
            .catch(function(error){
                console.error(error);
                interaction.reply('This pokemon doesn`t exist!');
            });
	},
};