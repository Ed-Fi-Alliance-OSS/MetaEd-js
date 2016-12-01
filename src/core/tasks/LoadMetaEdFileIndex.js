// @flow
import winston from 'winston';
import type { State } from '../State';
import MetaEdFile from './MetaEdFile';

function startNamespace(namespace: string, projectExtension: string, isExtension: boolean) {
  const adjustedProjectExtension = isExtension ? projectExtension : 'core';
  const startNamespaceFile = new MetaEdFile();
  startNamespaceFile.filename = 'InMemory';
  startNamespaceFile.setContents(`Begin Namespace ${namespace} ${adjustedProjectExtension}\n`);
  return startNamespaceFile;
}

function endNamespace() {
  const endNamespaceFile = new MetaEdFile();
  endNamespaceFile.filename = 'InMemory';
  endNamespaceFile.setContents('End Namespace\n');
  return endNamespaceFile;
}

export default function loadMetaEdFileIndex(state: State): State {
  if (state.filesToLoad == null) {
    winston.error('LoadMetaEdFileIndex: no files to load found');
    return state;
  }

  const metaEdFiles: MetaEdFile[] = [];
  state.get('filesToLoad').forEach(loading => {
    metaEdFiles.push(startNamespace(loading.namespace, loading.projectExtension, loading.isExtension));
    loading.files.forEach(file => {
      metaEdFiles.push(file);
    });
    metaEdFiles.push(endNamespace());
  });

  return state.set('metaEdFileIndex', state.get('metaEdFileIndex').load(metaEdFiles))
              .set('action', state.get('action').push('LoadMetaEdFileIndex'));
}

