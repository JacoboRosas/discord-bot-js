// This makes it so it requires and uses the package to load the .env file, and it also attached the variables to process.env
//This will have the enviromental variables, in this case, the discord_token.
const dotenv = require('dotenv');

dotenv.config();

//NOTES
//Guild is used by the Discord API and in discord.js to refer to a discord server.
//GatewayIntentBits.Guilds is neccesary for discord.js client to work, it ensures that the caches for guilds, channels and roles are populated and available for internal use.
//Intent also defines which events discord should send to the bot

// Require the necessary discord.js classes

// This is destructuring assignment for objects
//const { property } = object;
// With this we are importing these modules from the discord.js library
const { Client, Events, GatewayIntentBits } = require('discord.js');
// We are extracting the token property from the object returned from require('./config.json').
const { token } = require('./config.json');

// Create a new client instance
//These gateway intent bits define the types of events that the client will recieve from discord gateway.
const client = new Client({
     intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
 });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);


