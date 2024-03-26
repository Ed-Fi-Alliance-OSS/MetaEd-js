import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import klawSync from 'klaw-sync';
import path from 'path';
import { State } from '../State';
import { GeneratorResult } from '../generator/GeneratorResult';
import { Logger } from '../Logger';

export const METAED_OUTPUT = 'MetaEdOutput';
const LINUX_USER_FULL_CONTROL = 0o700;

async function writeOutputFiles(result: GeneratorResult, outputDirectory: string) {
  // eslint-disable-next-line no-restricted-syntax
  for (const output of result.generatedOutput) {
    const folderName: string =
      output.namespace != null && output.namespace !== '' ? `${output.namespace}/${output.folderName}` : output.folderName;
    if (!existsSync(`${outputDirectory}/${folderName}`))
      await fs.mkdir(`${outputDirectory}/${folderName}`, { mode: LINUX_USER_FULL_CONTROL, recursive: true });
    if (output.resultString)
      await fs.writeFile(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultString, 'utf-8');
    else if (output.resultStream)
      await fs.writeFile(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultStream);
    else Logger.debug(`No output stream or string for ${result.generatorName}`);
  }
}

export async function execute(state: State): Promise<boolean> {
  let outputDirectory = '';
  const [defaultRootDirectory] = state.inputDirectories.slice(-1);
  if (state.outputDirectory) {
    outputDirectory = path.resolve(state.outputDirectory, METAED_OUTPUT);
  } else if (state.metaEdConfiguration.artifactDirectory) {
    outputDirectory = path.resolve(defaultRootDirectory.path, state.metaEdConfiguration.artifactDirectory);
  } else if (state.inputDirectories && state.inputDirectories.length > 0) {
    outputDirectory = path.resolve(defaultRootDirectory.path, METAED_OUTPUT);
  }

  Logger.info(`- Artifact Directory: ${outputDirectory}`);

  try {
    if (existsSync(outputDirectory)) {
      if (!outputDirectory.includes(METAED_OUTPUT)) {
        Logger.error(
          `Unable to delete output directory at path "${outputDirectory}".  Output directory name must contain 'MetaEdOutput'.`,
        );
        return false;
      }

      const testForMetaEdFilePaths = klawSync(outputDirectory, {
        filter: (item) => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      });
      if (testForMetaEdFilePaths.length > 0) {
        Logger.error(`WriteOutput: MetaEd files found in output location '${outputDirectory}'. Not writing files.`);
        return false;
      }
      await fs.rm(outputDirectory, { recursive: true });
    }

    await fs.mkdir(outputDirectory, { mode: LINUX_USER_FULL_CONTROL, recursive: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const result of state.generatorResults) {
      await writeOutputFiles(result, outputDirectory);
    }

    state.metaEdConfiguration.artifactDirectory = outputDirectory;
    return true;
  } catch (exception) {
    Logger.error(`WriteOutput: Unable to write files to output location '${outputDirectory}'.`, exception);
    if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
      Logger.error('Please close any files or folders that may be open in other applications.');
    }
    return false;
  }
}
