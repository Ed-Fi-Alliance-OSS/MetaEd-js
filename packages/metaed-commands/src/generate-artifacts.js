// @flow
import { execConsole, getConsoleParams, getNodeModulesPath } from '../metaed-console';

export const command: string = 'generate-artifacts [options]';
export const desc: string = 'Generate Artifacts';
export const aliases: Array<string> = ['ga'];
export const builder = (yargs: any) => yargs
  .default('edfi', `${getNodeModulesPath()}\\ed-fi-model-2.0`)
  .alias('e', 'edfi')
  .nargs('e', 1)
  .alias('x', 'ext')
  .nargs('x', 1)
  .help();
export const handler = (argv: any) => { execConsole(getConsoleParams(argv.edfi, argv.ext)); };
