import { State } from '../State';
import { createMetaEdFile } from './MetaEdFile';
import { MetaEdFile, FileSet } from './MetaEdFile';
import { createFileIndex } from './FileIndex';
import { Logger } from '../Logger';

function startNamespace(namespace: string, projectExtension: string, isExtension: boolean) {
  const adjustedProjectExtension = isExtension ? projectExtension : 'core';
  return createMetaEdFile('InMemory', 'InMemory', `Begin Namespace ${namespace} ${adjustedProjectExtension}\n`);
}

function endNamespace() {
  return createMetaEdFile('InMemory', 'InMemory', 'End Namespace\n');
}

export function loadFileIndex(state: State): void {
  if (state.loadedFileSet == null) {
    Logger.error('LoadFileIndex: no files to load found');
    return;
  }

  const metaEdFiles: MetaEdFile[] = [];
  state.loadedFileSet.forEach((fileSet: FileSet) => {
    metaEdFiles.push(startNamespace(fileSet.namespaceName, fileSet.projectExtension, fileSet.isExtension));
    metaEdFiles.push(...fileSet.files);
    metaEdFiles.push(endNamespace());
  });

  state.fileIndex = createFileIndex(metaEdFiles);
}
