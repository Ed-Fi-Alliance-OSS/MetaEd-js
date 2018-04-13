// @flow
import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import type { EntityRepository } from '../model/EntityRepository';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';
import { NoNamespaceInfo, newNamespaceInfo } from '../model/NamespaceInfo';
import { sourceMapFrom } from '../model/SourceMap';
import { isErrorText } from './BuilderUtility';
import type { ValidationFailure } from '../validator/ValidationFailure';

export function namespaceName(context: MetaEdGrammar.NamespaceNameContext): string {
  if (
    context.exception ||
    context.NAMESPACE_ID() == null ||
    context.NAMESPACE_ID().exception != null ||
    context.NAMESPACE_ID().getText() == null ||
    isErrorText(context.NAMESPACE_ID().getText())
  )
    return '';

  return context.NAMESPACE_ID().getText();
}

function enteringNamespaceName(context: MetaEdGrammar.NamespaceNameContext, namespaceInfo: NamespaceInfo): NamespaceInfo {
  if (namespaceInfo === NoNamespaceInfo || isErrorText(context.NAMESPACE_ID().getText())) return newNamespaceInfo();

  if (
    context.exception ||
    context.NAMESPACE_ID() == null ||
    context.NAMESPACE_ID().exception != null ||
    context.NAMESPACE_ID().getText() == null
  )
    return namespaceInfo;

  Object.assign(namespaceInfo, { namespace: context.NAMESPACE_ID().getText() });
  Object.assign(namespaceInfo.sourceMap, { namespace: sourceMapFrom(context) });
  return namespaceInfo;
}

function enteringNamespaceType(context: MetaEdGrammar.NamespaceTypeContext, namespaceInfo: NamespaceInfo): NamespaceInfo {
  if (namespaceInfo === NoNamespaceInfo) return namespaceInfo;
  if (context.exception) return namespaceInfo;
  if (context.CORE() != null) {
    Object.assign(namespaceInfo, { projectExtension: '', projectName: 'Ed-Fi', isExtension: false });
    return namespaceInfo;
  }
  if (context.ID() == null || context.ID().exception != null || isErrorText(context.ID().getText())) return namespaceInfo;

  Object.assign(namespaceInfo, {
    projectExtension: context.ID().getText(),
    // note: currently using namespace type as friendly name also
    projectName: context.ID().getText(),
    isExtension: true,
  });
  Object.assign(namespaceInfo.sourceMap, { projectExtension: sourceMapFrom(context), isExtension: sourceMapFrom(context) });
  return namespaceInfo;
}

export class NamespaceInfoBuilder extends MetaEdGrammarListener {
  entityRepository: EntityRepository;
  currentNamespaceInfo: NamespaceInfo;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.entityRepository = metaEd.entity;
    this.currentNamespaceInfo = NoNamespaceInfo;
    this.validationFailures = validationFailures;
  }

  enterNamespace(context: MetaEdGrammar.NamespaceContext) {
    if (context.exception) return;
    if (this.currentNamespaceInfo !== NoNamespaceInfo) return;
    this.currentNamespaceInfo = newNamespaceInfo();
    this.currentNamespaceInfo.sourceMap.type = sourceMapFrom(context);
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    if (this.currentNamespaceInfo === NoNamespaceInfo) return;
    this.currentNamespaceInfo = enteringNamespaceName(context, this.currentNamespaceInfo);
  }

  enterNamespaceType(context: MetaEdGrammar.NamespaceTypeContext) {
    if (this.currentNamespaceInfo === NoNamespaceInfo) return;
    this.currentNamespaceInfo = enteringNamespaceType(context, this.currentNamespaceInfo);
    // we don't wait for exitNamespace to finish building NamespaceInfos
    this.entityRepository.namespaceInfo.set(this.currentNamespaceInfo.namespace, this.currentNamespaceInfo);
    this.currentNamespaceInfo = NoNamespaceInfo;
  }
}
