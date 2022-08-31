const { createLogger, transports , format} = require("winston");
const moment = require("moment");

const customFormat = format.combine(
    format.timestamp(),
    format.printf(info => {
        return `moment().format('DD-MM-YYYY') ` +`: ${info.message}`;
    }),
);

const logger = createLogger({
  format: customFormat,
  level: "info",
  transports: [new transports.File({ filename: "./logs/"+ moment().format('DD-MM-YYYY') +".log" })],
});

module.exports = logger;
