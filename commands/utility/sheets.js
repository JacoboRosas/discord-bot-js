const { SlashCommandBuilder } = require('discord.js');
const { google } = require('googleapis');
const { CLIENT_EMAIL, PRIVATE_KEY } = require('../../config.json');

const client = new google.auth.JWT(
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY.replace(/\\n/g,"\n"),
    ['https://www.googleapis.com/auth/spreadsheets']
  );
const googleSheets = google.sheets({ version: 'v4', auth: client });

const range = 'A:C';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sheets')
		.setDescription('Add a pokemon to a spreadsheet.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Pokemon name')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('ID of the Spreadsheet (Must be public)')
                .setRequired(true)),
        

	async execute(interaction) {
        let Pokedex;
        let P;

        const module = await import('pokedex-promise-v2');
        Pokedex = module.default || module;
        P = new Pokedex();

        let pokemon = interaction.options.getString('name');
        let spreadsheetid = interaction.options.getString('id');
        pokemon = pokemon.toLowerCase();
        
        //GET request to the PokeAPI, made when the getPokemonByName method of the Pokedex instance P is called
        //Returns a Promise
        P.getPokemonByName(pokemon)
            //If Promise is resolved
            .then(function(response){
                console.log(response);
                const typeNames = response.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
                const typesString = typeNames.join(', ');
                const Name = response.name.charAt(0).toUpperCase() + response.name.slice(1);
                const ID = response.id;

                const values =[[ID, Name, typesString]]

                //Here, we're basically preparing a "package" of information to send to the API, this is an object
                const request = {
                    spreadsheetId: spreadsheetid,
                    range: range,
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values:values
                    }
                };

                //POST Request, sending data to append to the specified sheet, with the request object we made before
                //Append method is used to append data in the request object to the google sheet
                //We also use a callback method after the request is complete, takes two parameters, err and res
                googleSheets.spreadsheets.values.append(request, (err,res) => {
                    if (err) {
                        console.log('There has been an error with the API: ' + err);
                        interaction.reply(`Can't add the values to the spreadsheet, check spreadsheet ID and accessibility of said spreadsheet.`)
                        return;
                    }
                    console.log('Added to the spreadsheet' + res);
                    interaction.reply(`Successfully added to the spreadsheet.`)
                });

                //interaction.reply(`Pokedex ID: ${response.id} \nName: ${response.name.charAt(0).toUpperCase() + response.name.slice(1)} \nType: ${typesString}`);
            })
            //Error catch
            .catch(function(error){
                console.error(error);
                interaction.reply('This pokemon doesn`t exist!');
            });
	},
};