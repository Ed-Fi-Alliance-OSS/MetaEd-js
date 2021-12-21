import ffs from 'final-fs';
import klawSync from 'klaw-sync';
import path from 'path';
import winston from 'winston';
import { State } from '../State';
import { GeneratorResult } from '../generator/GeneratorResult';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });
export const METAED_OUTPUT = 'MetaEdOutput';

function writeOutputFiles(result: GeneratorResult, outputDirectory: string) {
  result.generatedOutput.forEach((output) => {
    const folderName: string =
      output.namespace != null && output.namespace !== '' ? `${output.namespace}/${output.folderName}` : output.folderName;
    if (!ffs.existsSync(`${outputDirectory}/${folderName}`)) ffs.mkdirRecursiveSync(`${outputDirectory}/${folderName}`);
    if (output.resultString)
      ffs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultString, 'utf-8');
    else if (output.resultStream)
      ffs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultStream);
    else winston.debug(`No output stream or string for ${result.generatorName}`);
  });
}

export function execute(state: State): boolean {
  let outputDirectory = '';
  const [defaultRootDirectory] = state.inputDirectories.slice(-1);
  if (state.outputDirectory) {
    // TODO: not used?
    outputDirectory = path.resolve(state.outputDirectory, METAED_OUTPUT);
  } else if (state.metaEdConfiguration.artifactDirectory) {
    outputDirectory = path.resolve(defaultRootDirectory.path, state.metaEdConfiguration.artifactDirectory);
  } else if (state.inputDirectories && state.inputDirectories.length > 0) {
    outputDirectory = path.resolve(defaultRootDirectory.path, METAED_OUTPUT);
  }

  winston.info(`- Artifact Directory: ${outputDirectory}`);

  try {
    if (ffs.existsSync(outputDirectory)) {
      if (!outputDirectory.includes(METAED_OUTPUT)) {
        winston.error(
          `Unable to delete output directory at path "${outputDirectory}".  Output directory name must contain 'MetaEdOutput'.`,
        );
        return false;
      }

      const testForMetaEdFilePaths: string[] = klawSync(outputDirectory, {
        filter: (item) => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      });
      if (testForMetaEdFilePaths.length > 0) {
        winston.error(`WriteOutput: MetaEd files found in output location '${outputDirectory}'. Not writing files.`);
        return false;
      }
      ffs.rmdirRecursiveSync(outputDirectory);
    }

    ffs.mkdirRecursiveSync(outputDirectory);

    // TODO: change this to use async/await
    state.generatorResults.forEach((result) => {
      // if (result is a Promise)
      if ((result as any).then) {
        winston.debug('Resolving Promise:');
        (result as any).then((resolvedResult) => {
          writeOutputFiles(resolvedResult, outputDirectory);
        });
      } else writeOutputFiles(result, outputDirectory);
    });

    state.metaEdConfiguration.artifactDirectory = outputDirectory;
    return true;
  } catch (exception) {
    winston.error(`WriteOutput: Unable to write files to output location '${outputDirectory}'.`, exception);
    if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
      winston.error('Please close any files or folders that may be open in other applications.');
    }
    return false;
  }
}
