import semver from 'semver';
import { devEnvironmentCorrectedPath } from './Utility';

export function getCoreMetaEdSourceDirectory(): string {
  return atom.config.get('@edfi/atom-metaed.coreMetaEdSourceDirectory') || '';
}

export function setCoreMetaEdSourceDirectory(directory: string) {
  return atom.config.set('@edfi/atom-metaed.coreMetaEdSourceDirectory', directory);
}

export function getMetaEdJsConsoleSourceDirectory(): string {
  return devEnvironmentCorrectedPath('metaed-console');
}

export function getEdfiOdsApiSourceDirectory(): string {
  return atom.config.get('@edfi/atom-metaed.edfiOdsApiSourceDirectory') || '';
}

export function suppressDeleteOnDeploy(): boolean {
  return atom.config.get('@edfi/atom-metaed.suppressDeleteOnDeploy') || false;
}

export function getCmdFullPath(): string {
  return atom.config.get('@edfi/atom-metaed.cmdFullPath') || '';
}

export function validateOnTheFly(): boolean {
  return atom.config.get('@edfi/atom-metaed.validateOnTheFly');
}

export function getTargetDsVersion(): string {
  return atom.config.get('@edfi/atom-metaed.targetDsVersion');
}

export function getTargetDsVersionSemver(): string {
  return getTargetDsVersion() || '3.0.0';
}

export function setTargetDsVersion(targetDsVersion: string) {
  return atom.config.set('@edfi/atom-metaed.targetDsVersion', targetDsVersion);
}

export function getTargetOdsApiVersion(): string {
  return atom.config.get('@edfi/atom-metaed.targetOdsApiVersion');
}

export function getTargetOdsApiVersionSemver(): string {
  return (semver.coerce(getTargetOdsApiVersion()) || '').toString();
}

export function setTargetOdsApiVersion(targetOdsApiVersion: string) {
  return atom.config.set('@edfi/atom-metaed.targetOdsApiVersion', targetOdsApiVersion);
}

export function telemetryConsent(): string {
  return atom.config.get('@edfi/atom-metaed.telemetryConsent');
}

export function setTelemetryConsent(consent: string) {
  return atom.config.set('@edfi/atom-metaed.telemetryConsent', consent);
}

export function acceptedLicense(): boolean {
  return atom.config.get('@edfi/atom-metaed.acceptedLicense');
}

export function setAcceptedLicense() {
  // This is the permament recording
  atom.config.set('metaed-license.accepted', true);
  // This is the toggle checked for activation
  return atom.config.set('@edfi/atom-metaed.acceptedLicense', true);
}

export function allianceMode(): boolean {
  return atom.config.get('@edfi/atom-metaed.alliance.allianceMode');
}
