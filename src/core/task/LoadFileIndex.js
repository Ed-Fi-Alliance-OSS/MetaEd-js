// @flow
import winston from 'winston';
import type { State } from '../State';
import { createMetaEdFile } from './MetaEdFile';
import type { MetaEdFile } from './MetaEdFile';
import { createFileIndex } from './FileIndex';

function startNamespace(namespace: string, projectExtension: string, isExtension: boolean) {
  const adjustedProjectExtension = isExtension ? projectExtension : 'core';
  return createMetaEdFile('InMemory', 'InMemory', `Begin Namespace ${namespace} ${adjustedProjectExtension}\n`);
}

function endNamespace() {
  return createMetaEdFile('InMemory', 'InMemory', 'End Namespace\n');
}

export default function loadFileIndex(state: State): State {
  if (state.loadedFileSet == null) {
    winston.error('LoadFileIndex: no files to load found');
    return state;
  }

  const metaEdFiles: MetaEdFile[] = [];
  state.loadedFileSet.forEach(loading => {
    metaEdFiles.push(startNamespace(loading.namespace, loading.projectExtension, loading.isExtension));
    loading.files.forEach(file => {
      metaEdFiles.push(file);
    });
    metaEdFiles.push(endNamespace());
  });

  state.fileIndex = createFileIndex(metaEdFiles);
  return state;
}

