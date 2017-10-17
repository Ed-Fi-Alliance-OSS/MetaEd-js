// @flow
/* eslint-disable no-unused-expressions */
import yargs from 'yargs';

yargs
  .commandDir('src')
  .demandCommand()
  .help()
  .argv;
