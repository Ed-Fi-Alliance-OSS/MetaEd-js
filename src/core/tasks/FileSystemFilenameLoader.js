// @flow
import ffs from 'final-fs';
import path from 'path';
import MetaEdFile from './MetaEdFile';
import type { State } from '../State';

export type FilesToLoad = {
  namespace: string,
  projectExtension: string,
  isExtension: boolean,
  files: MetaEdFile[],
}

export type InputDirectory = {
  path: string,
  namespace: string,
  projectExtension: string,
  isExtension: boolean,
}


// TODO: this is fully synchronous, make async
export default function load(state: State): State {
  if (state.inputDirectories == null) {
    // TODO logger should warn on no input directories
    return state;
  }

  const filesToLoadArray: FilesToLoad[] = [];
  state.inputDirectories.forEach(inputDirectory => {
    const filesToLoad: FilesToLoad = {
      namespace: inputDirectory.namespace,
      projectExtension: inputDirectory.projectExtension,
      isExtension: inputDirectory.isExtension,
      files: [],
    };

    const files = ffs.readdirRecursiveSync(inputDirectory.path, true, inputDirectory.path);
    const filenamesToLoad = files.filter(x => x.endsWith('.metaed'));

    filenamesToLoad.forEach(filename => {
      const contents = ffs.readFileSync(filename, 'utf-8');
      const metaEdFile = new MetaEdFile();
      metaEdFile.setContents(contents);
      metaEdFile.directoryName = path.dirname(filename);
      metaEdFile.filename = path.basename(filename);
      filesToLoad.files.push(metaEdFile);
    });

    if (filesToLoad.files.length === 0) {
      // TODO logger should say:
      // _log.Warn(string.Format("No MetaEd files found in input directory \"{0}\".", inputDirectory.Path));
    }

    filesToLoadArray.push(filesToLoad);
  });

  // TODO: this is a mutation
  state.filesToLoad = filesToLoadArray;
  return state;
}

