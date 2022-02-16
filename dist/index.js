"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const command_1 = require("./command");
const status_1 = require("./status");
const tracker_1 = require("./tracker");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
const session = new tracker_1.Session();
client.once('ready', () => {
    console.log('Ready!');
});
client.login(process.env.DISCORD_BOT_TOKEN);
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const tracker = session.get(interaction);
    switch (interaction.commandName) {
        case 'track':
            const term = interaction.options.getString('term');
            const course = interaction.options.getString('course');
            const section = interaction.options.getNumber('section');
            if (!(term && course && section)) {
                interaction.reply('Missing options');
                return;
            }
            try {
                const identifier = (0, command_1.toIdentifier)(term, course, section);
                tracker.addSection(identifier);
                interaction.reply(`Added ${(0, status_1.sectionAsString)(identifier)} to tracked classes`);
            }
            catch (e) {
                interaction.reply(e.message);
            }
            break;
        case 'show':
            interaction.reply('Here ya go!');
            tracker.trackedSections.forEach((section) => {
                const { channel } = interaction;
                channel === null || channel === void 0 ? void 0 : channel.send(`${(0, status_1.sectionAsString)(section.identifier)}: ${section.status && (0, status_1.currentSectionAction)(section.status)}`);
            });
            break;
        case 'reset':
        default:
            tracker.reset();
            interaction.reply('All classes cleared');
            break;
    }
}));
//# sourceMappingURL=index.js.map