require("dotenv").config();
const telegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;
const pm2Service = require("./pm2Service");
let _bot;
const users = [];
const statusSymbol = {
  online: "\u{2705}",
  stopped: "\u{1F6AB}"
};
exports.initBot = () => {
  _bot = new telegramBot(TOKEN, { polling: true });
  return _bot;
};

exports.status = (msg, match) => {
  let processName = match[1];
  let existingProccess = false;
  let response = "<b>PROCESSES:</b>\n\n";
  checkUserExists(msg.chat.id);
  pm2Service.list(list => {
    try {
      list.forEach(process => {
        if (!processName) {
          response += pm2Service.processData(process);
          existingProccess = true;
        } else if (processName === process.name) {
          response += pm2Service.processData(process);
          existingProccess = true;
        }
      });
      response = existingProccess ? response : "<b>PROCESS NOT FOUND</b>\n\n";
      sendMessage(msg.chat.id, response);
    } catch (error) {
      console.log(error);
    }
  });
};
exports.shortStatus = (msg, match) => {
  let response = "<b>PROCESSES:</b>\n\n";
  checkUserExists(msg.chat.id);
  pm2Service.list(list => {
    try {
      list.forEach(process => {
        response += `<pre>${process.name}: ${process.pm2_env.status} ${
          statusSymbol[process.pm2_env.status]
        }\n\n--------------\n</pre>`;
      });
      sendMessage(msg.chat.id, response);
    } catch (error) {
      console.log(error);
    }
  });
};
exports.restart = (msg, match) => {
  let processName = match[1];
  checkUserExists(msg.chat.id);
  if (!processName) {
    sendMessage(msg.chat.id, "<b>INVALID PROCESS NAME</b>");
  } else {
    pm2Service.restart(processName, () => {
      sendMessage(
        msg.chat.id,
        `Process <i>${processName}</i> has been restarted\n`
      );
    });
  }
};
exports.start = (msg, match) => {
  let processName = match[1];
  checkUserExists(msg.chat.id);
  if (!processName) {
    sendMessage(msg.chat.id, "<b>INVALID PROCESS NAME</b>");
  } else {
    pm2Service.start(processName, () => {
      sendMessage(
        msg.chat.id,
        `Process <i>${processName}</i> has been started\n`
      );
    });
  }
};
exports.monitoring = () => {
  pm2Service.pm2Monitor((name, status) => {
    users.forEach(async id => {
      await sendMessage(
        id,
        `<pre>${name}: ${status} ${statusSymbol[status]}\n\n--------------\n</pre>`
      );
    });
  });
};
const sendMessage = (chat_id, response) => {
  return _bot.sendMessage(chat_id, `${response}`, {
    parse_mode: "html"
  });
};
const checkUserExists = id => {
  if (!users.includes(id)) {
    users.push(id);
  }
};
