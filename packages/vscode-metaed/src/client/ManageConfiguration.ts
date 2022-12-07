// eslint-disable-next-line import/no-unresolved
import { ConfigurationChangeEvent, OutputChannel, workspace } from 'vscode';
import {
  setCoreMetaEdSourceDirectory,
  getTargetDsVersion,
  setTargetDsVersion,
  getTargetOdsApiVersion,
  setTargetOdsApiVersion,
} from './PackageSettings';
import { devEnvironmentCorrectedPath, yieldToNextMacroTask } from './Utility';

// keys are ODS/API versions, values are corresponding DS versions supported
const odsApiToDsVersion: Map<string, string> = new Map([
  ['3.0.0', '3.0.0'],
  ['3.1.0', '3.1.0'],
  ['3.1.1', '3.1.0'],
  ['3.2.0', '3.1.0'],
  ['3.3.0', '3.2.0'],
  ['3.4.0', '3.2.0-b'],
  ['5.0.0', '3.2.0-c'],
  ['5.1.0', '3.2.0-c'],
  ['5.2.0', '3.3.0-a'],
  ['5.3.0', '3.3.1-b'],
  ['6.0.0', '4.0.0-a'],
  ['6.1.0', '4.0.0'],
]);

export async function switchCoreDsProjectOnDsChange(logOutputChannel: OutputChannel) {
  workspace.onDidChangeConfiguration(async (event: ConfigurationChangeEvent) => {
    if (!event.affectsConfiguration('metaed.targetDataStandardVersion')) return;
    await yieldToNextMacroTask();
    const newTargetDsVersion: string = getTargetDsVersion();

    try {
      if (newTargetDsVersion === '3.0.0')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.0'));
      if (newTargetDsVersion === '3.1.0')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.1'));
      if (newTargetDsVersion === '3.2.0')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2a'));
      if (newTargetDsVersion === '3.2.0-b')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2b'));
      if (newTargetDsVersion === '3.2.0-c')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2c'));
      if (newTargetDsVersion === '3.3.0-a')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3a'));
      if (newTargetDsVersion === '3.3.1-b')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3b'));
      if (newTargetDsVersion === '4.0.0-a')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0a'));
      if (newTargetDsVersion === '4.0.0')
        await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0'));
    } catch (e) {
      logOutputChannel.appendLine(`Exception: ${e}`);
    } finally {
      await yieldToNextMacroTask();
    }
  });
}

async function setCoreToSixDotX() {
  await setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0'));
  await setTargetDsVersion('4.0.0');
  await setTargetOdsApiVersion('6.1.0');
  await yieldToNextMacroTask();
}

export function switchCoreDsProjectOnOdsApiChange(logOutputChannel: OutputChannel) {
  workspace.onDidChangeConfiguration(async (event: ConfigurationChangeEvent) => {
    try {
      if (!event.affectsConfiguration('metaed.targetOdsApiVersion')) return;
      await yieldToNextMacroTask();
      const newTargetOdsApiVersion: string = getTargetOdsApiVersion();
      const newTargetDsVersion: string | undefined = odsApiToDsVersion.get(newTargetOdsApiVersion);
      if (newTargetDsVersion != null) {
        await setTargetDsVersion(newTargetDsVersion);
        await yieldToNextMacroTask();
      }
    } catch (e) {
      logOutputChannel.appendLine(`Exception: ${e}`);
    }
  });
}

// initialize package settings if invalid
export async function initializePackageSettings() {
  if (getTargetDsVersion() === '') {
    await setCoreToSixDotX();
  }

  // TODO: Enable once paths to Ed-Fi-Models are figured out
  // if (getCoreMetaEdSourceDirectory() === '' || !(await fs.exists(path.resolve(getCoreMetaEdSourceDirectory())))) {
  //   await setCoreToSixDotX();
  // }

  // await yieldToNextMacroTask();
}
