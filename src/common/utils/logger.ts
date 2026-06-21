import { Logger as NestLogger } from '@nestjs/common';

export class Logger {
  private readonly logger: NestLogger;

  constructor(context: string) {
    this.logger = new NestLogger(context);
  }

  log(message: string, meta?: Record<string, unknown>): void {
    this.logger.log(meta ? `${message} ${JSON.stringify(meta)}` : message);
  }

  error(message: string, trace?: string, meta?: Record<string, unknown>): void {
    this.logger.error(meta ? `${message} ${JSON.stringify(meta)}` : message, trace);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta ? `${message} ${JSON.stringify(meta)}` : message);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(meta ? `${message} ${JSON.stringify(meta)}` : message);
  }
}
