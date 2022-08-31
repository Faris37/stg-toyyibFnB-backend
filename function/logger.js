const { createLogger, transports , format} = require("winston");

const customFormat = format.combine(
    format.timestamp(),
    format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
);

const logger = createLogger({
  format: customFormat,
  level: "info",
  transports: [new transports.File({ filename: "./logs/combined.log" })],
});

module.exports = logger;
