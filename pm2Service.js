const pm2 = require("pm2");
const statusSymbol = {
  online: "\u{2705}",
  stopped: "\u{1F6AB}"
};
exports.list = callback => {
  pm2.list((err, list) => {
    if (err) {
      console.log(err);
    }
    callback(list);
  });
};
exports.processData = process => {
  return `<pre>STATUS: ${process.pm2_env.status}  ${
    statusSymbol[process.pm2_env.status]
  }\nNAME: ${process.name}\nID: ${process.pid}\nMEMORY: ${(
    process.monit.memory /
    1024 /
    1024
  ).toFixed(2)}MB\nCPU:${process.monit.cpu} %\n--------------\n</pre>`;
};
exports.restart = (processName, callback) => {
  pm2.restart(processName, (err, process) => {
    if (err) {
      error(err);
    }
    callback();
  });
};
exports.start = (processName, callback) => {
  pm2.start(processName, (err, process) => {
    if (err) {
      error(err);
    }
    callback();
  });
};
exports.pm2Monitor = callback => {
  setInterval(() => {
    pm2.list((err, list) => {
      if (err) {
        console.log(err);
      } else {
        list.forEach(process => {
          if (process.pm2_env.status === "stopped") {
            callback(process.name, process.pm2_env.status);
          }
        });
      }
    });
  }, 300000);
};
