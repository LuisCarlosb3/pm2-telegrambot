const botActions = require("./botService");
const bot = botActions.initBot();
bot.onText(/\/status (.+)|\/status/, botActions.status);
bot.onText(/\/shortstatus/, botActions.shortStatus);
bot.onText(/\/restart (.+)|\/restart/, botActions.restart);
bot.onText(/\/start (.+)|\/start/, botActions.start);
botActions.monitoring();
