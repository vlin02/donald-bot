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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
require("dotenv/config");
const addTicket_1 = __importDefault(require("./commands/addTicket"));
const clearTickets_1 = __importDefault(require("./commands/clearTickets"));
const showTickets_1 = __importDefault(require("./commands/showTickets"));
const client_1 = require("./client");
const updateAllTickets_1 = __importDefault(require("./events/updateAllTickets"));
const database_1 = require("./database");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.connectToDatabase)();
        console.log('Connected to database');
        const commandHandlers = {
            'add-ticket': addTicket_1.default,
            'clear-tickets': clearTickets_1.default,
            'show-tickets': showTickets_1.default
        };
        client_1.botClient.once('ready', () => {
            setInterval(updateAllTickets_1.default, Number(process.env.STATUS_UPDATE_INTERVAL) * 1000);
            console.log('Ticket updates scheduled');
        });
        client_1.botClient.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            const { commandName } = interaction;
            if (!(commandName in commandHandlers)) {
                interaction.reply('Command not found');
                return;
            }
            const handler = commandHandlers[commandName];
            handler(interaction);
        }));
        console.log('Listening for commands');
    });
}
exports.main = main;
main();
//# sourceMappingURL=index.js.map