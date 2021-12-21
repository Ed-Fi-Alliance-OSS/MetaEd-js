// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import { findMetaEdProjectMetadata, MetaEdProjectMetadata } from '../common/Projects';

export async function findMetaEdProjectMetadataForClient(): Promise<MetaEdProjectMetadata[]> {
  const projectPaths: string[] = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders.map((wf) => wf.uri.fsPath)
    : [];
  return findMetaEdProjectMetadata(projectPaths);
}
