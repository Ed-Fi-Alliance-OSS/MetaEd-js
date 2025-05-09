// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import winston from 'winston';

const convertErrorToString = (err) => {
  // Preserve any dictionary, but otherwise convert to string
  if (err != null && err.constructor !== Object) {
    return err.toString();
  }
  return err;
};

// Create and set up a silent default logger transport - in case a library is using the default logger
const transport = new winston.transports.Console();
transport.silent = true;
winston.configure({ transports: [transport] });

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL?.toLocaleLowerCase() ?? 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.align(),
    }),
  ],
});

export const Logger = {
  fatal: (message: string, err?: any | null) => {
    logger.error({ message, err: convertErrorToString(err) });
    process.exit(1);
  },
  error: (message: string, err?: any | null) => {
    logger.error({ message, error: convertErrorToString(err) });
  },
  warn: (message: string) => {
    logger.warn({ message });
  },
  info: (message: string, extra?: any | null) => {
    logger.info({ message, extra });
  },
  verbose: (message: string) => {
    logger.verbose({ message });
  },
  debug: (message: string, extra?: any | null) => {
    logger.debug({ message, extra });
  },
  trace: (message: string) => {
    logger.debug({ message: JSON.stringify(message) });
  },
  child: () => Logger,
};

export function isDebugEnabled(): boolean {
  return logger.levels[logger.level] >= logger.levels.debug;
}

export function isInfoEnabled(): boolean {
  return logger.levels[logger.level] >= logger.levels.info;
}
