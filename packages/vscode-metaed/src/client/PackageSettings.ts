// eslint-disable-next-line import/no-unresolved
import { workspace, WorkspaceConfiguration } from 'vscode';
import semver from 'semver';

function getWorkspaceConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration('metaed');
}

export function getCoreMetaEdSourceDirectory(): string {
  return getWorkspaceConfiguration().get('coreMetaEdSourceDirectory') ?? '';
}

export function setCoreMetaEdSourceDirectory(directory: string) {
  return getWorkspaceConfiguration().update('coreMetaEdSourceDirectory', directory);
}

export function getEdfiOdsApiSourceDirectory(): string {
  return getWorkspaceConfiguration().get('edfiOdsApiSourceDirectory') ?? '';
}

export function suppressDeleteOnDeploy(): boolean {
  return getWorkspaceConfiguration().get('suppressDeleteOnDeploy') ?? false;
}

export function getTargetDsVersion(): string {
  return getWorkspaceConfiguration().get('targetDataStandardVersion') ?? '';
}

export function getTargetDsVersionSemver(): string {
  const targetDsVersion: string = getTargetDsVersion();
  return targetDsVersion === '' ? '6.1.0' : targetDsVersion;
}

export function setTargetDsVersion(targetDsVersion: string) {
  return getWorkspaceConfiguration().update('targetDataStandardVersion', targetDsVersion);
}

export function getTargetOdsApiVersion(): string {
  return getWorkspaceConfiguration().get('targetOdsApiVersion') ?? '';
}

export function getTargetOdsApiVersionSemver(): string {
  return (semver.coerce(getTargetOdsApiVersion()) || '').toString();
}

export function setTargetOdsApiVersion(targetOdsApiVersion: string) {
  return getWorkspaceConfiguration().update('targetOdsApiVersion', targetOdsApiVersion);
}

export function telemetryConsent(): string {
  return getWorkspaceConfiguration().get('telemetryConsent') ?? '';
}

export function setTelemetryConsent(consent: string) {
  return getWorkspaceConfiguration().update('telemetryConsent', consent);
}

export function acceptedLicense(): boolean {
  return getWorkspaceConfiguration().get('acceptedLicense') ?? false;
}

export function setAcceptedLicense() {
  return getWorkspaceConfiguration().update('acceptedLicense', true);
}

export function allianceMode(): boolean {
  return getWorkspaceConfiguration().get('allianceMode') ?? false;
}
