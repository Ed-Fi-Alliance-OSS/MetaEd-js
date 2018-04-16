/** @babel */
// @flow
import R from 'ramda';
import path from 'path';
import fs from 'fs-extra';
import type { State, ValidationFailure } from 'metaed-core';
import { executePipeline, newState } from 'metaed-core';

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
function lint(textEditor: AtomTextEditor): ?Promise<?(any[])> {
  if (!fs.existsSync(path.resolve(getCoreMetaEdSourceDirectory()))) {
    atom.notifications.addWarning(
      'The "Ed-Fi Data Standard core .metaed directory" in your Atom-MetaEd settings is not valid.',
    );
    return null;
  }

  const inputDirectories = [
    {
      path: getCoreMetaEdSourceDirectory(),
      namespace: 'edfi',
      projectExtension: '',
      projectName: 'Ed-Fi',
      isExtension: false,
    },
  ];

  // TODO: support multiple extension projects
  if (atom.project.getPaths().length > 1) {
    inputDirectories.push({
      path: atom.project.getPaths()[1],
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      projectName: 'Extension',
      isExtension: true,
    });
  }

  mostRecentState = Object.assign(newState(), {
    inputDirectories,
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: false,
      stopOnValidationFailure: false,
    },
    metaEdConfiguration: metaEdConfigurationFor(getTargetOdsApiVersionSemver()),
  });

  // temporary set of data standard version until lookup from project package.json is ready
  mostRecentState.metaEd.dataStandardVersion = getTargetDsVersionSemver();
  if (validateOnTheFly()) mostRecentState = loadFromModifiedEditors(mostRecentState);

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
