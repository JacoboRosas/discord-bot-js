const { SlashCommandBuilder } = require('discord.js');
const { google } = require('googleapis');
const { CLIENT_EMAIL, PRIVATE_KEY } = require('../../config.json'); //import client emaail and private key, required for aunthentication
const fetchPokemonDataByName = require('../../api-functions/fetchPokemonDataByName');

const client = new google.auth.JWT( //Aunthentication stuff for google
    CLIENT_EMAIL,
    null,
    PRIVATE_KEY.replace(/\\n/g,"\n"),
    ['https://www.googleapis.com/auth/spreadsheets']
  );
const range = 'A:C'; //Range, used to append the values to the sheet

module.exports = {
	data: new SlashCommandBuilder() //create command
		.setName('sheets2')
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
        
	async execute(interaction) { //takes user interaction
        let token = await new Promise((resolve, reject) => { //we create the token variable to hold the token required to connect to google, we use promise to make sure it either rejects or resolves the request
            //and then resumes the code afterwards
            //created everytime the bot uses this command
            client.authorize(function (err, tokens) { //google stuff needed to authorize
                if (err) {
                    console.log(err);
                    reject(err); //returns an error
                } else {
                    console.log("Successfully connected to Google!");
                    console.log("Access token:", tokens.access_token);
                    resolve(tokens.access_token); //returns the token
                }
            });
        });
        
        //variables used to hold the name of the pokemon used to make the get request for the pokeapi and the post request to google sheets
        let pokemon = interaction.options.getString('name');
        let spreadsheetid = interaction.options.getString('id');
        pokemon = pokemon.toLowerCase();
        
        //GET method by default when not specifying any other method
        fetchPokemonDataByName(pokemon)
        .then(data => {
            //saves the name, id and type of the pokemon
            const typeNames = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
            const typesString = typeNames.join(', ');
            const Name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const ID = data.id;

            //save these values into an array, which contains these values
            const values =[[ID, Name, typesString]]

            //here, we're basically preparing a "package" of information to send to the API, this is an object
            const request = {
                spreadsheetId: spreadsheetid,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values:values
                }
            };

            //POST request to send to the sheet
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${request.spreadsheetId}/values/${request.range}:append?valueInputOption=${request.valueInputOption}`, {
                method: 'POST', //define the method we will use, in this case POST
                headers:{
                    'Content-Type': 'application/json', //application/json since we are sending a json format
                    'Authorization': 'Bearer ' + token, //here we use the token obtained previously for authorization
                },
                body: JSON.stringify(request.resource), //convert to json string so it can be read by the api
            })
            .then (response => {
                if(!response.ok) { //checks if response was ok
                    interaction.reply(`HTTP Error found: ${response.status}`);
                    throw new Error(`HTTP error: ${response.status}`);
                }
                response.json(); //converts response to json
            })
            .then(data => { //takes the json file
                console.log(data) //for debugging purposes, to check the json
                interaction.reply(`Successfully added ${pokemon} to the spreadsheet!`);

            })
            .catch((error)=>{
                console.error('Error:', error);
            });
        })
        .catch((error) =>{
            interaction.reply(`Cannot find this Pokemon!`);
            console.error('Error:', error);
        });
	},
};