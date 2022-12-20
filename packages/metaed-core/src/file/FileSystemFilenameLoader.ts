import fs from 'node:fs';
import klawSync from 'klaw-sync';
import path from 'path';
import winston from 'winston';
import { createMetaEdFile } from './MetaEdFile';
import { FileSet } from './MetaEdFile';
import { State } from '../State';
import { MetaEdConfiguration } from '../MetaEdConfiguration';

export function loadFiles(state: State): boolean {
  let success = true;
  const { metaEdConfiguration }: { metaEdConfiguration: MetaEdConfiguration } = state;

  if (metaEdConfiguration.projects.length !== metaEdConfiguration.projectPaths.length) {
    winston.error('FileSystemFilenameLoader: project metadata must be same length as project paths');
    return false;
  }

  if (!Array.isArray(state.inputDirectories)) state.inputDirectories = [];

  for (let i = 0; i < metaEdConfiguration.projects.length; i += 1) {
    const projectExtension =
      metaEdConfiguration.projects[i].projectExtension ||
      (metaEdConfiguration.projects[i].namespaceName === 'EdFi' ? '' : 'EXTENSION');

    state.inputDirectories.push({
      path: metaEdConfiguration.projectPaths[i],
      namespaceName: metaEdConfiguration.projects[i].namespaceName,
      projectExtension,
      projectName: metaEdConfiguration.projects[i].projectName,
      isExtension: metaEdConfiguration.projects[i].namespaceName !== 'EdFi',
    });
  }

  const fileSets: FileSet[] = [];
  let filenamesFoundInDirectories = false;

  state.inputDirectories.forEach((inputDirectory) => {
    const fileSet: FileSet = {
      namespaceName: inputDirectory.namespaceName,
      projectExtension: inputDirectory.projectExtension,
      projectName: inputDirectory.projectName,
      isExtension: inputDirectory.isExtension,
      files: [],
    };

    try {
      const filenames: string[] = klawSync(inputDirectory.path, {
        filter: (item) => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      }).map((klawObject) => klawObject.path);

      if (filenames.length > 0) {
        filenamesFoundInDirectories = true;
      }

      const filenamesToLoad: string[] = filenames.filter((filename) => !state.filePathsToExclude.has(filename));

      filenamesToLoad.forEach((filename) => {
        const contents = fs.readFileSync(filename, 'utf-8');
        const metaEdFile = createMetaEdFile(path.dirname(filename), path.basename(filename), contents);
        fileSet.files.push(metaEdFile);
      });

      winston.info(
        `- ${inputDirectory.path} (${filenamesToLoad.length} .metaed file${filenamesToLoad.length > 1 ? 's' : ''} loaded)`,
      );

      fileSets.push(fileSet);
    } catch (exception) {
      winston.error(`FileSystemFilenameLoader: Unable to read files at location '${inputDirectory.path}'.`, exception);
      if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
        winston.error('Please close any files or folders that may be open in other applications.');
      }
      success = false;
    }
  });

  if (!filenamesFoundInDirectories) {
    winston.error('No MetaEd files found in any input directory.');
    success = false;
  }

  state.loadedFileSet.push(...fileSets);
  return success;
}
