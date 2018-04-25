/** @babel */
// @flow

// eslint-disable-next-line
import { CompositeDisposable } from 'atom';
import MetaEdConsole from './MetaEdConsole';
import { build, deploy } from './MetaEdConsoleJs';
import {
  createFromTemplate,
  createNewExtensionProject,
  associationTemplate,
  choiceTemplate,
  commonTemplate,
  descriptorTemplate,
  domainEntityTemplate,
  domainTemplate,
  enumerationTemplate,
  interchangeTemplate,
  sharedDecimalTemplate,
  sharedIntegerTemplate,
  sharedStringTemplate,
} from './ProjectTemplates';
import { isCoreMetaEdFile } from './MakeCoreTabsReadOnly';
import { allianceMode } from './PackageSettings';
import type OutputWindow from './OutputWindow';

let metaEdConsole: ?MetaEdConsole;

function getContextPaths(commandTarget: any) {
  // console.log(commandTarget.classList);
  const cssSelector = '.icon-file-directory';
  // Check current dom node to see if its a directory
  let selectedDirectory = commandTarget.classList.contains(cssSelector);
  if (!selectedDirectory) {
    // If not found, check the descendants
    selectedDirectory = commandTarget.querySelector(cssSelector);
    if (!selectedDirectory) {
      // As a last resort, check for ancestors
      selectedDirectory = commandTarget.closest(cssSelector);
    }
  }

  let targetFolder: string = '';
  if (selectedDirectory) {
    targetFolder = selectedDirectory.dataset.path;
  }
  return targetFolder;
}

const fileFromTemplateEvent = (commandEvent: any, filename: string, template: () => string) => {
  const targetPath = getContextPaths(commandEvent.target);
  if (!targetPath) {
    atom.confirm({ message: 'Select a directory for new file creation.' });
    return;
  }
  if (isCoreMetaEdFile(targetPath) && !allianceMode()) {
    atom.confirm({ message: 'New files cannot be created in a Core MetaEd directory.' });
    return;
  }
  createFromTemplate(targetPath, filename, template);
};

export function initializeCommands(disposableTracker: CompositeDisposable, outputWindow: OutputWindow): void {
  metaEdConsole = new MetaEdConsole(outputWindow);

  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:about': () => {
        atom.workspace.open('atom-metaed://about');
      },
    }),
  );

  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:settings': () => {
        atom.workspace.open('atom://config/packages/atom-metaed');
      },
    }),
  );

  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:build': async () => {
        if (metaEdConsole != null)
          if (outputWindow != null) {
            const success: boolean = await build(outputWindow); // MetaEdJsConsole
            if (success) await metaEdConsole.build();
          }
      },
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:deploy': async () => {
        if (outputWindow == null) return;
        if (metaEdConsole == null) return;

        const result = atom.confirm({
          message: 'Are you sure you want to deploy MetaEd artifacts?',
          detailedMessage:
            'This will overwrite core and extension files in the Ed-Fi ODS / API with MetaEd generated versions.  You will need to run initdev afterwards to reinitialize the Ed-Fi ODS / API.',
          buttons: ['OK', 'Cancel'],
        });
        if (result !== 0) return;

        let success: boolean = await build(outputWindow); // MetaEdJsConsole
        if (success) success = await metaEdConsole.build();
        if (success) await deploy(outputWindow, allianceMode());
      },
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:build-js': async () => {
        if (outputWindow != null) {
          await build(outputWindow); // MetaEdJsConsole
        }
      },
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:crash': () => {
        this.subscriptions.add(null); // force a crash -- this.subscriptions is undefined
      },
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:createNewExtensionProject': () => {
        createNewExtensionProject(outputWindow);
      },
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addAssociationTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'Association.metaed', associationTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addChoiceTemplate': commandEvent => fileFromTemplateEvent(commandEvent, 'Choice.metaed', choiceTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addSharedDecimalTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'SharedDecimal.metaed', sharedDecimalTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addSharedIntegerTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'SharedInteger.metaed', sharedIntegerTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addSharedStringTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'SharedString.metaed', sharedStringTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addCommonTemplate': commandEvent => fileFromTemplateEvent(commandEvent, 'Common.metaed', commonTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addDescriptorTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'Descriptor.metaed', descriptorTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addDomainEntityTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'DomainEntity.metaed', domainEntityTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addDomainTemplate': commandEvent => fileFromTemplateEvent(commandEvent, 'Domain.metaed', domainTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addEnumerationTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'Enumeration.metaed', enumerationTemplate),
    }),
  );
  disposableTracker.add(
    atom.commands.add('atom-workspace', {
      'atom-metaed:addInterchangeTemplate': commandEvent =>
        fileFromTemplateEvent(commandEvent, 'Interchange.metaed', interchangeTemplate),
    }),
  );
}
