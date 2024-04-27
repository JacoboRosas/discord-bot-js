const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fetchRandomPokemon = require('../../functions/api-functions/fetchRandomPokemon.js');
const darkenPokemonImage = require('../../functions/other-functions/darkenPokemonImage.js');
const fs = require('fs');

const guessingUsers = new Set();

async function startGame(interaction){
    const randomPokemon = await fetchRandomPokemon();
    const spritePath = await darkenPokemonImage(randomPokemon.id);
    console.log(spritePath);   
    console.log(randomPokemon.id);
    let imageName = String(randomPokemon.id).padStart(3,0) + '_dark.png';
    console.log(imageName);
    const attachment = new AttachmentBuilder(spritePath)
    //const spriteUrl = randomPokemon.sprites.front_default;  //This instead gets the sprites from the json file we got
    const embed = new EmbedBuilder()
        //.setTitle(`#${randomPokemon.id} ${randomPokemon.name}`)
        .setColor(0x0099FF)
        .setTitle('     Guess the Pokemon!')
        .setDescription('Can you guess this Pokemon?')
        .setFooter({text: 'Good luck!'})
        .setImage(`attachment://${imageName}`);

    interaction.reply({embeds:[embed], files:[attachment]}).then(()=>{
    fs.unlink(spritePath, (err) => { // Delete the image
            if (err) {
                console.error(`Error deleting file: ${err}`);
            } else {
                console.log(`File deleted: ${spritePath}`);
            }
    });
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({filter, max:1, time:15000});
    collector.on('collect', m=> {
    if (m.content.toLowerCase() == 'stop'){
        m.reply('Quiz stopped!');
        collector.stop();
        guessingUsers.delete(interaction.user.id);
        }
        else if (m.content.toLowerCase()==randomPokemon.name){
            m.reply(`Correct, that pokemon is ${randomPokemon.name}`);
            guessingUsers.delete(interaction.user.id);
        }
        else{
            m.reply(`Incorrect guess! The Pokemon was ${randomPokemon.name}.`);
            guessingUsers.delete(interaction.user.id);
        }
        })
    });
};

module.exports = {
data: new SlashCommandBuilder() //Create the slash command 
	.setName('randompokemon')
	.setDescription('Get a random Pokemon name and sprite.'),

    async execute(interaction) {
        // Check if the user is already guessing
        if (guessingUsers.has(interaction.user.id)) {
            return interaction.reply({content: 'You are already guessing a Pokemon! Please respond to the previous guess before starting a new one.', ephemeral:true});
        }
    
        // Add the user to the Set of guessing users
        guessingUsers.add(interaction.user.id);
    
        // Start the game
        startGame(interaction);
    },
};