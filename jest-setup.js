// eslint-disable-next-line import/no-extraneous-dependencies
const winston = require('winston');

const transport = new winston.transports.Console();
transport.silent = true;
winston.configure({ transports: [transport] });
