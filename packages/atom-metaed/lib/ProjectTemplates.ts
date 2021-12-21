import fs from 'fs-extra';
import path from 'path';
import { updateCoreMetaEdSourceDirectory } from './CoreSourceDirectoryUpdater';
import { getCoreMetaEdSourceDirectory } from './PackageSettings';
import { newProjectJson } from './Projects';
import { OutputWindow } from './OutputWindow';

export function createNewExtensionProject(outputWindow: OutputWindow): void {
  // Ensure core is set up correctly
  updateCoreMetaEdSourceDirectory();
  const projectCount = atom.project.getPaths().length;
  if (projectCount === 0) {
    outputWindow.addMessage(`Unable to set up MetaEd Core Source File Directory '${getCoreMetaEdSourceDirectory()}'.`);
  } else if (projectCount > 0) {
    atom.pickFolder((selectedPaths: string[]) => {
      if (selectedPaths == null || selectedPaths.length === 0) return;
      selectedPaths.forEach(async (selectedPath) => {
        atom.project.addPath(selectedPath);
        await newProjectJson(selectedPath);
      });
    });
  }
}

export function createFromTemplate(targetPath: string, targetFileName: string, template: () => string) {
  let targetFullFilePath = path.join(targetPath, targetFileName);
  let counter = 1;
  const startOfFile = path.basename(targetFullFilePath, path.extname(targetFullFilePath));
  while (fs.existsSync(targetFullFilePath)) {
    targetFullFilePath = path.join(
      path.dirname(targetFullFilePath),
      startOfFile + counter + path.extname(targetFullFilePath),
    );
    counter += 1;
  }
  fs.writeFileSync(targetFullFilePath, template());
}

export function packageJsonTemplate(projectName: string, projectVersion: string): string {
  return `{
  "metaEdProject": {
    "projectName": "${projectName}",
    "projectVersion": "${projectVersion}"
  }
}`;
}

export function associationTemplate(): string {
  return `Association ExampleName
    documentation "This is documentation."
    domain entity FirstEntityName
        documentation "This is documentation."
    domain entity SecondEntityName
        documentation "This is documentation."
    bool PropertyName
        documentation "This is documentation."
        is part of identity
`;
}

export function choiceTemplate(): string {
  return `Choice ExampleName
    documentation "This is documentation."
    bool FirstPropertyName
        documentation "This is documentation."
        is required
    bool SecondPropertyName
        documentation "This is documentation."
        is required
`;
}

export function commonTemplate(): string {
  return `Common ExampleName
    documentation "This is documentation."
    bool PropertyName
        documentation "This is documentation."
        is part of identity
`;
}

export function descriptorTemplate(): string {
  return `Descriptor ExampleName
    documentation "This is documentation."
    with map type
        documentation "This is documentation."
        item "ShortDescription"
`;
}

export function domainEntityTemplate(): string {
  return `Domain Entity ExampleName
    documentation "This is documentation."
    bool PropertyName
        documentation "This is documentation."
        is part of identity
`;
}

export function domainTemplate(): string {
  return `Domain ExampleName
    documentation "This is documentation."
    domain entity ItemName
    footer documentation "This is documentation."
`;
}

export function enumerationTemplate(): string {
  return `Enumeration ExampleName
    documentation "This is documentation."
    item "ItemName"
        documentation "This is documentation."
`;
}

export function interchangeTemplate(): string {
  return `Interchange ExampleName
    documentation "This is documentation."
    extended documentation "This is documentation."
    use case documentation "This is documentation."
    domain entity ElementName
`;
}

export function sharedDecimalTemplate(): string {
  return `Shared Decimal ExampleName
    documentation "This is documentation."
    total digits 9
    decimal places 3
    min value 0
    max value 100
`;
}

export function sharedIntegerTemplate(): string {
  return `Shared Integer ExampleName
    documentation "This is documentation."
    min value 0
    max value 100
`;
}

export function sharedStringTemplate(): string {
  return `Shared String ExampleName
    documentation "This is documentation."
    min length 1
    max length 20
`;
}
