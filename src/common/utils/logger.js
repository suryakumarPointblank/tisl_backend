import { Logger as NestLogger } from '@nestjs/common';

export class Logger {
  constructor(context) {
    this.logger = new NestLogger(context);
  }

  log(message, meta) {
    this.logger.log(typeof meta === 'object' ? `${message} ${JSON.stringify(meta)}` : message);
  }

  error(message, trace, meta) {
    this.logger.error(typeof meta === 'object' ? `${message} ${JSON.stringify(meta)}` : message, trace);
  }

  warn(message, meta) {
    this.logger.warn(typeof meta === 'object' ? `${message} ${JSON.stringify(meta)}` : message);
  }

  debug(message, meta) {
    this.logger.debug(typeof meta === 'object' ? `${message} ${JSON.stringify(meta)}` : message);
  }
}
