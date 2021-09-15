import { String as sugar } from 'sugar';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { NamespaceRepository } from '../model/NamespaceRepository';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { NoNamespace, newNamespace } from '../model/Namespace';
import { isErrorText } from './BuilderUtility';
import { ValidationFailure } from '../validator/ValidationFailure';

export function namespaceNameFrom(context: MetaEdGrammar.NamespaceNameContext): string {
  if (
    context.exception ||
    context.ID() == null ||
    context.ID().exception != null ||
    context.ID().getText() == null ||
    isErrorText(context.ID().getText())
  )
    return '';

  return context.ID().getText();
}

function enteringNamespaceName(context: MetaEdGrammar.NamespaceNameContext, namespace: Namespace): Namespace {
  if (
    namespace === NoNamespace ||
    (!context.exception &&
      context.ID() != null &&
      !context.ID().exception &&
      context.ID().getText() != null &&
      isErrorText(context.ID().getText()))
  )
    return newNamespace();

  if (context.exception || context.ID() == null || context.ID().exception != null || context.ID().getText() == null)
    return namespace;

  Object.assign(namespace, { namespaceName: context.ID().getText() });

  // This is a good guess -- capitalize the namespace -- given that projectName is not in the language yet,
  // but the AddProjectNameToNamespace task sets the correct value after the builders run,
  // so this is overwritten later.
  namespace.projectName = sugar.capitalize(namespace.namespaceName);

  return namespace;
}

function enteringNamespaceType(context: MetaEdGrammar.NamespaceTypeContext, namespace: Namespace): Namespace {
  if (namespace === NoNamespace) return namespace;
  if (context.exception) return namespace;
  if (context.CORE() != null) {
    Object.assign(namespace, { projectExtension: '', projectName: 'EdFi', isExtension: false });
    return namespace;
  }
  if (context.ID() == null || context.ID().exception != null || isErrorText(context.ID().getText())) return namespace;

  Object.assign(namespace, {
    projectExtension: context.ID().getText(),
    isExtension: true,
  });
  return namespace;
}

/**
 * An ANTLR4 listener that creates Namespace entities.  All other ANTLR4 listener Builders depend on NamespaceBuilder.
 * NamespaceBuilder must always listen first.
 */
export class NamespaceBuilder extends MetaEdGrammarListener {
  namespaceRepository: NamespaceRepository;

  currentNamespace: Namespace;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.namespaceRepository = metaEd.namespace;
    this.currentNamespace = NoNamespace;
    this.validationFailures = validationFailures;
  }

  enterNamespace(context: MetaEdGrammar.NamespaceContext) {
    if (context.exception) return;
    if (this.currentNamespace !== NoNamespace) return;
    this.currentNamespace = newNamespace();
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    if (this.currentNamespace === NoNamespace) return;
    this.currentNamespace = enteringNamespaceName(context, this.currentNamespace);
  }

  enterNamespaceType(context: MetaEdGrammar.NamespaceTypeContext) {
    if (this.currentNamespace === NoNamespace) return;
    this.currentNamespace = enteringNamespaceType(context, this.currentNamespace);

    // we don't wait for exitNamespace to finish building Namespaces
    if (!this.namespaceRepository.has(this.currentNamespace.namespaceName)) {
      this.namespaceRepository.set(this.currentNamespace.namespaceName, this.currentNamespace);
    }
    this.currentNamespace = NoNamespace;
  }
}
