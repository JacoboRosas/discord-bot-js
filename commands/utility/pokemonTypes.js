const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetchPokemonDataByName = require('../../functions/api-functions/fetchPokemonDataByName'); //Import function created before
const fetchPokemonTypeChart = require('../../functions/api-functions/fetchPokemonTypeChart');
const getPokemonImageURL = require('../../functions/other-functions/getPokemonImageURL');

module.exports = {
	data: new SlashCommandBuilder() //Create the slash command 
		.setName('pokemontype')
		.setDescription('Display a Pokemon types.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the Pokemon')
                .setRequired(true)),

	async execute(interaction) { //Receive the discord interaction
        let reply = '';
        let pokemon = interaction.options.getString('name'); //create variable that holds the pokemon name, we take this value from interaction.options.getString
        pokemon = pokemon.toLowerCase(); //make it lowercase so it doesn't have any issues when making the GET request

        const pokemonData = await fetchPokemonDataByName(pokemon); //send pokemon name
        const chart = await fetchPokemonTypeChart(pokemonData);
        console.log(chart);
        
        //Save the chart in different strings
        //We use if to check if any array is empty, if they are, they get ignored
        reply += '**2x Damage From: **';
        if(chart.weaknesses.length>0){
        reply += chart.weaknesses.join(', ');
        }
        if(chart.fourTimesWeaknesses.length>0){
            reply += '\n**4x Damage From:** ';
            reply += chart.fourTimesWeaknesses.join(', ');
        }
        if(chart.immunity.length>0){
            reply += '\n**Immune to: **';
            reply += chart.immunity.join(', ');
        }
        if(chart.halfDamage.length>0){
            reply += '\n**1/2 Damage From: **';
            reply += chart.halfDamage.join(', ');
        }
        if(chart.quarterDamage.length>0){
            reply += '\n**1/4 Damage From: **';
            reply += chart.quarterDamage.join(', ');
        }
        const imageUrl = await getPokemonImageURL(pokemonData.id);
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`#${pokemonData.id} ${pokemonData.name}`)
        .setImage(imageUrl)
        .setDescription(`${reply}`)
        .setFooter({text: 'Made using Pokeapi'});


        interaction.reply({embeds:[embed]})
        //interaction.reply(`#${pokemonData.id} ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}\n` + `${reply}`)
        .catch((error) =>{
            console.error('Error:', error);
            interaction.reply(`Can't find the Pokemon!`); //error in case it can't find the pokemon
        });
	},
};