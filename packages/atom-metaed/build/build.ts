import { exec } from 'child_process';
import AdmZip from 'adm-zip';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

const atomChannel: string = process.env.ATOM_CHANNEL || 'stable';
const rootDirectory: string = path.resolve(`${__dirname}/../../../../../`);
const packageDirectory: string = path.join(rootDirectory, '/MetaEd-Js/packages/atom-metaed');
const atomDirectory: string = path.join(rootDirectory, '/Atom');
const atomExecutable: string = path.join(atomDirectory, '/atom.exe');
const atomScript: string = path.join(atomDirectory, '/resources/cli/atom.cmd');
const apmScript: string = path.join(atomDirectory, '/resources/app/apm/bin/apm.cmd');
// const npmScript: string = path.join(atomDirectory, '/resources/app/apm/node_modules/.bin/npm.cmd');

const atomUrl = `https://atom.io/download/windows_zip?channel=${atomChannel}`;
const atomZip: string = path.join(rootDirectory, '/atom.zip');

const apmTestPackages: string[] = [];

const execCommand = (command: string, options: Record<string, any> = {}) =>
  new Promise((resolve) => {
    exec(command, options, (error, stdout) => {
      if (error) {
        winston.error(error);
        process.exit(1);
      }
      resolve(stdout.toString());
    });
  });

const setElectronEnvironmentVariables = (): void => {
  winston.info(`Setting environment variables`);
  process.env.PATH = `${path.join(atomDirectory, '\\resources\\app\\apm\\bin')};${process.env.PATH || ''}`;
  process.env.ELECTRON_NO_ATTACH_CONSOLE = 'true';
  process.env.ELECTRON_ENABLE_LOGGING = 'YES';
};

const downloadAtom = async (): Promise<void> => {
  winston.info(`Downloading latest release of Atom (${atomChannel})`);
  const source = await axios.get(atomUrl, { responseType: 'arraybuffer' });
  await fs.writeFile(atomZip, source.data);
};

const extractAtom = async (): Promise<void> => {
  winston.info(`Unzipping Atom`);
  if (fs.existsSync(atomDirectory)) {
    fs.removeSync(atomDirectory);
  }
  const zip = new AdmZip(atomZip);
  await zip.extractAllTo(rootDirectory);
};

const displayVersions = async (): Promise<void> => {
  winston.info(`\natom.exe ${await execCommand(`${atomExecutable} -v`)}`);
  winston.info(`\natom.cmd ${await execCommand(`${atomScript} -v`)}`);
};

const installPackages = async (): Promise<void> => {
  winston.info(`Installing packages`);
  await execCommand(`${apmScript} clean`, { cwd: rootDirectory });
  winston.info((await execCommand(`${apmScript} install`, { cwd: rootDirectory })) as Object);
};

const installDependencies = async (): Promise<void> => {
  if (process.env.ATOM_TEST_PACKAGES != null) {
    apmTestPackages.push(...process.env.ATOM_TEST_PACKAGES.split(/\s+/));
    winston.info(`Installing package dependencies`);
    // eslint-disable-next-line no-restricted-syntax
    for (const pkg of apmTestPackages) {
      // eslint-disable-next-line no-await-in-loop
      winston.info((await execCommand(`${apmScript} install ${pkg}`, { cwd: rootDirectory })) as Object);
    }
  }
};

const runTests = async (): Promise<void> => {
  winston.info(`Running tests`);
  winston.info((await execCommand(`${atomExecutable} --test spec`, { cwd: packageDirectory })) as Object);
};

const build = async (): Promise<void> => {
  setElectronEnvironmentVariables();
  await downloadAtom();
  await extractAtom();
  await displayVersions();
  await installPackages();
  await installDependencies();
  await runTests();
};

build();
