// @flow
import ffs from 'final-fs';
import path from 'path';
import winston from 'winston';
import { createMetaEdFile } from './MetaEdFile';
import type { FileSet } from './MetaEdFile';
import type { State } from '../State';
import type { MetaEdConfiguration } from '../MetaEdConfiguration';

export type InputDirectory = {
  path: string,
  namespace: string,
  projectExtension: string,
  projectName: string,
  isExtension: boolean,
};

export function loadFiles(state: State): boolean {
  let success: boolean = true;
  const metaEdConfiguration: MetaEdConfiguration = state.metaEdConfiguration;

  if (metaEdConfiguration.projects.length !== metaEdConfiguration.projectPaths.length) {
    winston.error('FileSystemFilenameLoader: project metadata must be same length as project paths');
    return false;
  }

  if (!Array.isArray(state.inputDirectories)) state.inputDirectories = [];

  for (let i = 0; i < metaEdConfiguration.projects.length; i += 1) {
    const projectExtension =
      metaEdConfiguration.projects[i].projectExtension ||
      (metaEdConfiguration.projects[i].namespace === 'edfi' ? '' : 'EXTENSION');

    state.inputDirectories.push({
      path: metaEdConfiguration.projectPaths[i],
      namespace: metaEdConfiguration.projects[i].namespace,
      projectExtension,
      projectName: metaEdConfiguration.projects[i].projectName,
      isExtension: metaEdConfiguration.projects[i].namespace !== 'edfi',
    });
  }

  const fileSets: FileSet[] = [];
  state.inputDirectories.forEach(inputDirectory => {
    const fileSet: FileSet = {
      namespace: inputDirectory.namespace,
      projectExtension: inputDirectory.projectExtension,
      projectName: inputDirectory.projectName,
      isExtension: inputDirectory.isExtension,
      files: [],
    };

    const filenames: string[] = ffs
      .readdirRecursiveSync(inputDirectory.path, true, inputDirectory.path)
      .filter(filename => filename.endsWith('.metaed'));

    if (filenames.length === 0) {
      winston.error(`No MetaEd files found in input directory ${inputDirectory.path}.`);
      success = false;
    }

    const filenamesToLoad: string[] = filenames.filter(filename => !state.filePathsToExclude.has(filename));

    filenamesToLoad.forEach(filename => {
      const contents = ffs.readFileSync(filename, 'utf-8');
      const metaEdFile = createMetaEdFile(path.dirname(filename), path.basename(filename), contents);
      fileSet.files.push(metaEdFile);
    });

    winston.info(
      `  ${inputDirectory.path} (${filenamesToLoad.length} .metaed file${filenamesToLoad.length > 1 ? 's' : ''} loaded)`,
    );

    fileSets.push(fileSet);
  });

  state.loadedFileSet.push(...fileSets);
  return success;
}
