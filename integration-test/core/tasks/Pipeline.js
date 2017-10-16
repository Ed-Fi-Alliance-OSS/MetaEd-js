// @flow
import R from 'ramda';
import { loadFiles } from '../../../packages/../packages/metaed-core/src/task/FileSystemFilenameLoader';
import { validateSyntax } from '../../../packages/../packages/metaed-core/src/task/ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../../../packages/../packages/metaed-core/src/grammar/ParseTreeBuilder';
import loadFileIndex from '../../../packages/metaed-core/src/task/LoadFileIndex';
import { buildParseTree } from '../../../packages/metaed-core/src/task/BuildParseTree';
import { execute as walkBuilders } from '../../../packages/metaed-core/src/task/WalkBuilders';
import { fileMapForFailure } from '../../../packages/metaed-core/src/task/FileMapForFailure';
import {
  executeAssociationBuilder,
  executeAssociationExtensionBuilder,
  executeAssociationSubclassBuilder,
  executeChoiceBuilder,
  executeCommonBuilder,
  executeCommonExtensionBuilder,
  executeDecimalTypeBuilder,
  executeDescriptorBuilder,
  executeDomainBuilder,
  executeDomainEntityBuilder,
  executeDomainEntityExtensionBuilder,
  executeDomainEntitySubclassBuilder,
  executeEnumerationBuilder,
  executeIntegerTypeBuilder,
  executeInterchangeBuilder,
  executeNamespaceInfoBuilder,
  executeSharedDecimalBuilder,
  executeSharedIntegerBuilder,
  executeSharedStringBuilder,
  executeStringTypeBuilder,
} from '../../../packages/metaed-core/src/task/WalkBuildersP';
import { execute as runValidators } from '../../../packages/metaed-core/src/task/RunValidators';
import { loadPlugins } from '../../../packages/metaed-core/src/task/LoadPlugins';
import type { State } from '../../../packages/metaed-core/src/State';

const builders: Array<any> = [
  executeAssociationBuilder,
  executeAssociationExtensionBuilder,
  executeAssociationSubclassBuilder,
  executeAssociationSubclassBuilder,
  executeChoiceBuilder,
  executeChoiceBuilder,
  executeCommonBuilder,
  executeCommonExtensionBuilder,
  executeDecimalTypeBuilder,
  executeDescriptorBuilder,
  executeDescriptorBuilder,
  executeDomainBuilder,
  executeDomainBuilder,
  executeDomainEntityBuilder,
  executeDomainEntityExtensionBuilder,
  executeDomainEntitySubclassBuilder,
  executeEnumerationBuilder,
  executeIntegerTypeBuilder,
  executeIntegerTypeBuilder,
  executeInterchangeBuilder,
  executeNamespaceInfoBuilder,
  executeSharedDecimalBuilder,
  executeSharedDecimalBuilder,
  executeSharedIntegerBuilder,
  executeSharedStringBuilder,
  executeStringTypeBuilder,
];

export async function startingFromFileLoadP(state: State): Promise<State> {
  await loadFiles(state);
  await loadPlugins(state);
  await validateSyntax(buildTopLevelEntity, state);
  await loadFileIndex(state);
  await buildParseTree(buildMetaEd, state);
  await builders.forEach(async builder => builder(state));
  await runValidators(state);
  await fileMapForFailure(state);
  return state;
}

export function startingFromFileLoad(state: State): State {
  return R.pipe(
    loadFiles,
    validateSyntax(buildTopLevelEntity),
    loadFileIndex,
    buildParseTree(buildMetaEd),
    walkBuilders,
    runValidators,
    fileMapForFailure,
  )(state);
}
