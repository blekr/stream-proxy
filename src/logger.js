import winston from 'winston';
import isEmpty from 'lodash/isEmpty';

const transports = [
  new winston.transports.Console({
    formatter: ({ message, meta, level }) => {
      const metaString = isEmpty(meta)
        ? ''
        : `\n\t${JSON.stringify(meta, null, 2)}`;
      return `[ipc-proxy] ${level}: ${message}${metaString}`.replace(
        /\n/g,
        '\r',
      );
    },
  }),
];

const logger = new winston.Logger({
  level: 'info',
  transports,
});

export default logger;
