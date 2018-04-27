/** @babel */
// @flow
import R from 'ramda';
import path from 'path';
import fs from 'fs-extra';
import type { State, ValidationFailure, MetaEdConfiguration } from 'metaed-core';
import { executePipeline, newState } from 'metaed-core';
import type { MetaEdProjectMetadata } from './Projects';
import { findMetaEdProjectMetadata } from './Projects';
import { metaEdConfigurationFor } from './MetaEdConfigurationFactory';
import reportException from './ExceptionReporter';
import { loadFromModifiedEditors } from './BufferFileLoader';
import {
  getCoreMetaEdSourceDirectory,
  validateOnTheFly,
  getTargetOdsApiVersionSemver,
  getTargetDsVersionSemver,
} from './PackageSettings';

let mostRecentState: State = newState();

const limitThirty = R.take(30);

// eslint-disable-next-line no-unused-vars
async function lint(textEditor: AtomTextEditor): ?Promise<?(any[])> {
  if (!await fs.exists(path.resolve(getCoreMetaEdSourceDirectory()))) {
    atom.notifications.addWarning(
      'The "Ed-Fi Data Standard core .metaed directory" in your Atom-MetaEd settings is not valid.',
    );
    return null;
  }

  const metaEdProjectMetadata: Array<MetaEdProjectMetadata> = await findMetaEdProjectMetadata(true);

  // this is from MetaEdConsoleJs - will ignore for now, but provides validations to an OutputWindow
  // may want to do a notification equivalent...
  // if (!validProjectMetadata(metaEdProjectMetadata, outputWindow)) return false;

  const metaEdConfiguration: MetaEdConfiguration = metaEdConfigurationFor(getTargetOdsApiVersionSemver());

  metaEdProjectMetadata.forEach(pm => {
    metaEdConfiguration.projects.push({
      namespace: pm.projectNamespace,
      projectName: pm.projectName,
      projectVersion: pm.projectVersion,
      projectExtension: pm.projectExtension,
    });
    metaEdConfiguration.projectPaths.push(pm.projectPath);
  });

  mostRecentState = Object.assign(newState(), {
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: false,
      stopOnValidationFailure: false,
    },
    metaEdConfiguration,
  });

  mostRecentState.metaEd.dataStandardVersion = getTargetDsVersionSemver();
  if (validateOnTheFly()) loadFromModifiedEditors(mostRecentState, metaEdProjectMetadata);

  const linterMessages: Promise<?(any[])> = executePipeline(mostRecentState)
    .then((stateAndFailure: { state: State, failure: boolean }) => {
      mostRecentState = stateAndFailure.state;
      return limitThirty(mostRecentState.validationFailure).map((errorMessage: ValidationFailure) => {
        const tokenLength: number =
          errorMessage.sourceMap && errorMessage.sourceMap.tokenText ? errorMessage.sourceMap.tokenText.length : 0;
        const adjustedLine: number =
          !errorMessage.fileMap || errorMessage.fileMap.lineNumber === 0 ? 0 : errorMessage.fileMap.lineNumber - 1;
        const characterPosition: number = errorMessage.sourceMap ? errorMessage.sourceMap.column : 0;

        return {
          severity: errorMessage.category,
          excerpt: errorMessage.message,
          location: {
            file: errorMessage.fileMap ? errorMessage.fileMap.fullPath : '',
            position: [[adjustedLine, characterPosition], [adjustedLine, characterPosition + tokenLength]],
          },
        };
      });
    })
    .catch(exception => {
      reportException(exception);
      console.error(exception);
      if (atom.inDevMode()) throw exception;
      return null; // null means no changes to linter messages
    });

  return linterMessages;
}

export function linterConfiguration() {
  return {
    name: 'MetaEd',
    grammarScopes: ['source.metaed'],
    scope: 'project',
    lintsOnChange: validateOnTheFly(),
    lintOnChangeInterval: 500,
    lint,
  };
}
