import path from 'path';
import fs from 'fs-extra';
import { getCoreMetaEdSourceDirectory } from './PackageSettings';

let coreMetaEdSourceDirectory: string = getCoreMetaEdSourceDirectory();

export function updateCoreMetaEdSourceDirectory() {
  const newCoreMetaEdSourceDirectory = getCoreMetaEdSourceDirectory();
  if (!fs.existsSync(newCoreMetaEdSourceDirectory)) {
    return;
  }
  if (!coreMetaEdSourceDirectory) {
    coreMetaEdSourceDirectory = newCoreMetaEdSourceDirectory;
  }
  const projectPaths = atom.project
    .getPaths()
    .filter((projectPath) => path.normalize(projectPath) !== path.normalize(coreMetaEdSourceDirectory));
  projectPaths.unshift(newCoreMetaEdSourceDirectory);
  atom.project.setPaths(projectPaths);
  coreMetaEdSourceDirectory = newCoreMetaEdSourceDirectory;
}
