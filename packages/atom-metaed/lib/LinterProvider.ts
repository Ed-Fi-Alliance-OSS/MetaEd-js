// eslint-disable-next-line import/no-unresolved
import { TextEditor } from 'atom';
import R from 'ramda';
import path from 'path';
import fs from 'fs-extra';
import { State, ValidationFailure, MetaEdConfiguration, PipelineFailure, executePipeline, newState } from 'metaed-core';
import { MetaEdProjectMetadata } from './Projects';
import { findMetaEdProjectMetadata } from './Projects';
import { metaEdConfigurationFor } from './MetaEdConfigurationFactory';
import reportException from './ExceptionReporter';
import { loadFromModifiedEditors } from './BufferFileLoader';
import {
  getCoreMetaEdSourceDirectory,
  validateOnTheFly,
  getTargetOdsApiVersionSemver,
  getTargetDsVersionSemver,
  allianceMode,
} from './PackageSettings';

let mostRecentState: State = newState();

const limitThirty = R.take(30);

function notifyPipelineFailures(pipelineFailures: PipelineFailure[]) {
  if (pipelineFailures.find(pipelineFailure => pipelineFailure.message)) {
    const message: string = pipelineFailures.map(pipelineFailure => pipelineFailure.message).join('<br/><br/>');
    atom.notifications.addError(message, {
      dismissable: true,
      icon: 'shield',
    });
  }
}

const notifyPipelineFailuresOnce = R.once(notifyPipelineFailures);

async function lint(_textEditor: TextEditor): Promise<any[] | null> {
  if (!(await fs.exists(path.resolve(getCoreMetaEdSourceDirectory())))) {
    atom.notifications.addWarning(
      'The "Ed-Fi Data Standard core .metaed directory" in your Atom-MetaEd settings is not valid.',
    );
    return null;
  }

  const metaEdProjectMetadata: MetaEdProjectMetadata[] = await findMetaEdProjectMetadata(true);

  // this is from MetaEdConsoleJs - will ignore for now, but provides validations to an OutputWindow
  // may want to do a notification equivalent...
  // if (!validProjectMetadata(metaEdProjectMetadata, outputWindow)) return false;

  const metaEdConfiguration: MetaEdConfiguration = metaEdConfigurationFor(getTargetOdsApiVersionSemver(), allianceMode());

  metaEdProjectMetadata.forEach(pm => {
    metaEdConfiguration.projects.push({
      namespaceName: pm.projectNamespace,
      projectName: pm.projectName,
      projectVersion: pm.projectVersion,
      projectExtension: pm.projectExtension,
      description: pm.projectDescription,
    });
    metaEdConfiguration.projectPaths.push(pm.projectPath);
  });

  mostRecentState = {
    ...newState(),
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: false,
      stopOnValidationFailure: false,
    },
    metaEdConfiguration,
  };

  mostRecentState.metaEd.dataStandardVersion = getTargetDsVersionSemver();
  if (validateOnTheFly()) loadFromModifiedEditors(mostRecentState, metaEdProjectMetadata);

  const linterMessages: Promise<any[] | null> = executePipeline(mostRecentState)
    .then((stateAndFailure: { state: State; failure: boolean }) => {
      mostRecentState = stateAndFailure.state;
      notifyPipelineFailuresOnce(mostRecentState.pipelineFailure);
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
    grammarScopes: ['source.metaed', 'source.json'],
    scope: 'project',
    lintsOnChange: validateOnTheFly(),
    lintOnChangeInterval: 500,
    lint,
  };
}
