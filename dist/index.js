"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
// Create a new client instance
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});
// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);
