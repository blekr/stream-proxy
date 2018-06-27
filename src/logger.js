import winston from 'winston';

const transports = [new winston.transports.Console()];

const logger = new winston.Logger({
  level: 'info',
  transports,
});

export default logger;
