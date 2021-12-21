/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */

import os from 'os';
import path from 'path';
import stackTrace from 'stack-trace';
import {
  getCoreMetaEdSourceDirectory,
  getEdfiOdsApiSourceDirectory,
  getCmdFullPath,
  validateOnTheFly,
  telemetryConsent,
  setTelemetryConsent,
  allianceMode,
} from './PackageSettings';
import { devEnvironmentCorrectedPath } from './Utility';

const atomMetaEdPackageJson = require(path.resolve(__dirname, '../package.json'));
const metaEdJsPackageJson = require(devEnvironmentCorrectedPath('metaed-core/package.json'));
const edFiModel20PackageJson = require(devEnvironmentCorrectedPath('ed-fi-model-2.0/package.json'));
const edFiModel30PackageJson = require(devEnvironmentCorrectedPath('ed-fi-model-3.0/package.json'));

const API_KEY = '572fefe3d435ced414e482499146e61e';
const StackTraceCache = new WeakMap();

const request = window.fetch; // eslint-disable-line no-undef
const alwaysReport = true;
const reportPreviousErrors = true;
const reportedErrors: any[] = [];

function parseStackTrace(error) {
  let callSites = StackTraceCache.get(error);
  if (callSites) return callSites;

  callSites = stackTrace.parse(error);
  StackTraceCache.set(error, callSites);
  return callSites;
}

function normalizePath(filepath) {
  if (!filepath) return '';
  return filepath
    .replace('file:///', '') // Randomly inserted file url protocols
    .replace(/[/]/g, '\\') // Temp switch for Windows home matching
    .replace(os.homedir(), '~') // Remove users home dir for apm-dev'ed packages
    .replace(/\\/g, '/') // Switch \ back to / for everyone
    .replace(/.*(\/(app\.asar|packages\/).*)/, '$1'); // Remove everything before app.asar or packages
}

function buildStackTraceJSON(error) {
  return parseStackTrace(error).map((callSite) =>
    // eslint-disable-line arrow-body-style
    ({
      file: normalizePath(callSite.getFileName()),
      method: callSite.getMethodName() || callSite.getFunctionName() || 'none',
      lineNumber: callSite.getLineNumber(),
      columnNumber: callSite.getColumnNumber(),
      inProject: !/node_modules/.test(callSite.getFileName()),
    }),
  );
}

function buildExceptionJSON(error) {
  return {
    errorClass: error.constructor.name,
    message: error.message,
    stacktrace: buildStackTraceJSON(error),
  };
}

function buildNotificationJSON(error) {
  return {
    apiKey: API_KEY,
    notifier: {
      name: 'atom-metaed',
      version: atomMetaEdPackageJson.version,
      url: 'https://github.com/Ed-Fi-Alliance/MetaEd-IDE',
    },
    events: [
      {
        payloadVersion: '2',
        exceptions: [buildExceptionJSON(error)],
        severity: 'error',
        user: {
          id: atom.config.get('metaed-exception-report.user'),
        },
        app: {
          version: atomMetaEdPackageJson.version,
        },
        device: {
          osVersion: `${os.platform()}-${os.arch()}-${os.release()}`,
        },
        metaData: error.metadata,
      },
    ],
  };
}

function getAtomReleaseChannel(version) {
  return version.indexOf('beta') > -1 // eslint-disable-line no-nested-ternary
    ? 'beta'
    : version.indexOf('dev') > -1
    ? 'dev'
    : 'stable';
}

function performRequest(json) {
  request.call(null, 'https://notify.bugsnag.com', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }), // eslint-disable-line no-undef
    body: JSON.stringify(json),
  });
}

function shouldReport(error) {
  if (atom.inDevMode()) return false;
  if (alwaysReport) return true; // Used in specs

  const topFrame = parseStackTrace(error)[0];
  return topFrame && topFrame.getFileName() && topFrame.getFileName().indexOf(atom.getLoadSettings().resourcePath) === 0;
}

function addAtomMetadata(error) {
  const activePackages = atom.packages.getActivePackages();
  const communityPackages = {};
  const corePackages = {};
  if (activePackages.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pack of atom.packages.getActivePackages()) {
      if (/\/app\.asar\//.test(pack.path)) {
        // @ts-ignore: Package.metadata is not exposed in typings file
        corePackages[pack.name] = pack.metadata.version;
      } else {
        // @ts-ignore: Package.metadata is not exposed in typings file
        communityPackages[pack.name] = pack.metadata.version;
      }
    }
  }
  error.metadata.atom = {
    'core-packages': corePackages,
    'community-packages': communityPackages,
    version: atom.getVersion(),
    'release-stage': getAtomReleaseChannel(atom.getVersion()),
  };
}

function addPreviousErrorsMetadata(error) {
  if (!reportPreviousErrors) return;
  error.metadata.previousErrors = reportedErrors.map((reportedError) => reportedError.message);
}

function addMetaEdIdeMetadata(error) {
  error.metadata.metaedversion = {
    'atom-metaed': {
      version: atomMetaEdPackageJson.version,
      dependencies: atomMetaEdPackageJson.dependencies,
    },
    'metaed-core': {
      version: metaEdJsPackageJson.version,
    },
    'ed-fi-model-2.0': {
      version: edFiModel20PackageJson.version,
    },
    'ed-fi-model-3.0': {
      version: edFiModel30PackageJson.version,
    },
  };

  error.metadata.metaedsettings = {
    'Core-MetaEd-Directory': getCoreMetaEdSourceDirectory(),
    'Ods-Api-Directory': getEdfiOdsApiSourceDirectory(),
    'Windows-Command-Prompt': getCmdFullPath(),
    validateOnTheFly: validateOnTheFly(),
    allianceMode: allianceMode(),
    'Project-Paths': atom.project.getPaths(),
  };
}

function submitReport(error: any) {
  error.metadata = {};
  addAtomMetadata(error);
  addPreviousErrorsMetadata(error);
  addMetaEdIdeMetadata(error);

  performRequest(buildNotificationJSON(error));
  reportedErrors.push(error);
}

export default function reportException(error: any) {
  if (!shouldReport(error)) return;

  if (telemetryConsent() === 'true') {
    submitReport(error);
    return;
  }

  if (telemetryConsent() == null || telemetryConsent() === '') {
    const dialog = atom.notifications.addInfo(
      'The Ed-Fi Alliance would like to collect anonymous information to resolve an error that has occurred.',
      {
        description:
          'Select whether you are willing to submit anonymous usage information to the Ed-Fi Alliance server. Broadly, we send things like performance metrics and exceptions. Your selection can be changed at any time in atom-metaed package settings.',
        dismissable: true,
        buttons: [
          {
            text: 'Never',
            onDidClick: () => {
              setTelemetryConsent('false');
              if (dialog) dialog.dismiss();
            },
          },
          {
            text: 'Submit This Exception',
            onDidClick: () => {
              if (dialog) dialog.dismiss();
              submitReport(error);
            },
          },
          {
            text: 'Always',
            onDidClick: () => {
              setTelemetryConsent('true');
              if (dialog) dialog.dismiss();
              submitReport(error);
            },
          },
        ],
      },
    );
  }
}
