// @flow
import path from 'path';
import { spawn } from 'child_process';
import { Logger, transports } from 'winston';

const logger = new Logger({ level: 'info', transports: [new transports.Console()] });
logger.cli();

export const getNodeModulesPath = (): string => path.resolve(__dirname, '../../node_modules');

export const getConsolePath = (): string => path.resolve(__dirname, '../../dist/metaed-console/src/metaed-console.js');

export const getConsoleParams = (metaEdPath: string, extensionPath: ?string): Array<string> => {
  const params: Array<string> = [];
  params.push(...['-e', metaEdPath]);
  if (extensionPath != null) params.push(...['-x', extensionPath]);
  return params;
};

export const execConsole = (params: Array<string>): void => {
  const child = spawn('node', [getConsolePath(), ...params]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('close', (code) => {
    if (code !== 0) logger.error(new Error('Error on call to MetaEd console application'));
  });
};
