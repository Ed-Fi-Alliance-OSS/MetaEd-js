import type {
  DeprecatedContext,
  DocumentationContext,
  ExtendedDocumentationContext,
  ExtendeeNameContext,
  InterchangeContext,
  InterchangeElementContext,
  InterchangeExtensionContext,
  InterchangeIdentityContext,
  InterchangeNameContext,
  MetaEdIdContext,
  NamespaceNameContext,
  UseCaseDocumentationContext,
} from '../grammar/gen/MetaEdGrammar';
import MetaEdGrammarListener from '../grammar/gen/MetaEdGrammarListener';

import { Interchange, InterchangeSourceMap } from '../model/Interchange';
import { InterchangeItem } from '../model/InterchangeItem';
import { EntityRepository } from '../model/EntityRepository';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { NoNamespace } from '../model/Namespace';

import { newInterchange, NoInterchange } from '../model/Interchange';
import { newInterchangeItem, NoInterchangeItem } from '../model/InterchangeItem';
import { newInterchangeExtension } from '../model/InterchangeExtension';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText, extractDeprecationReason } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';
import { ValidationFailure } from '../validator/ValidationFailure';

/**
 * An ANTLR4 listener that creates Interchange entities.
 */
export class InterchangeBuilder extends MetaEdGrammarListener {
  metaEd: MetaEdEnvironment;

  entityRepository: EntityRepository;

  currentNamespace: Namespace;

  currentInterchange: Interchange;

  currentInterchangeItem: InterchangeItem;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.currentNamespace = NoNamespace;
    this.currentInterchange = NoInterchange;
    this.currentInterchangeItem = NoInterchangeItem;
    this.validationFailures = validationFailures;
  }

  enterNamespaceName = (context: NamespaceNameContext) => {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  };

  enterDeprecated = (context: DeprecatedContext) => {
    if (this.currentInterchange === NoInterchange) return;

    if (!context.exception) {
      this.currentInterchange.isDeprecated = true;
      this.currentInterchange.deprecationReason = extractDeprecationReason(context);
      this.currentInterchange.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentInterchange.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  };

  enterDocumentation = (context: DocumentationContext) => {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.documentation = extractDocumentation(context);
    this.currentInterchange.sourceMap.documentation = sourceMapFrom(context);
  };

  enterExtendedDocumentation = (context: ExtendedDocumentationContext) => {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.extendedDocumentation = extractDocumentation(context);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).extendedDocumentation = sourceMapFrom(context);
  };

  enterUseCaseDocumentation = (context: UseCaseDocumentationContext) => {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.useCaseDocumentation = extractDocumentation(context);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).useCaseDocumentation = sourceMapFrom(context);
  };

  enterMetaEdId = (context: MetaEdIdContext) => {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.METAED_ID() == null || isErrorText(context.METAED_ID().getText())) return;

    if (this.currentInterchangeItem !== NoInterchangeItem) {
      this.currentInterchangeItem.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentInterchangeItem.sourceMap.metaEdId = sourceMapFrom(context);
    } else {
      this.currentInterchange.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentInterchange.sourceMap.metaEdId = sourceMapFrom(context);
    }
  };

  enterInterchange = (context: InterchangeContext) => {
    this.currentInterchange = { ...newInterchange(), namespace: this.currentNamespace };

    Object.assign(this.currentInterchange.sourceMap, {
      type: sourceMapFrom(context),
    });
  };

  enterInterchangeExtension = (context: InterchangeExtensionContext) => {
    this.currentInterchange = { ...newInterchangeExtension(), namespace: this.currentNamespace };
    this.currentInterchange.sourceMap.type = sourceMapFrom(context);
  };

  exitingInterchange() {
    if (this.currentInterchange === NoInterchange) return;
    if (this.currentInterchange.metaEdName) {
      const extensionMessageString = this.currentInterchange.type === 'interchangeExtension' ? 'Extension ' : '';

      if (this.currentNamespace.entity[this.currentInterchange.type].has(this.currentInterchange.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'InterchangeBuilder',
          category: 'error',
          message: `Interchange ${extensionMessageString}named ${this.currentInterchange.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentInterchange.sourceMap.metaEdName,
          fileMap: null,
        });

        const duplicateEntity: Interchange = this.currentNamespace.entity[this.currentInterchange.type].get(
          this.currentInterchange.metaEdName,
        );
        this.validationFailures.push({
          validatorName: 'InterchangeBuilder',
          category: 'error',
          message: `Interchange ${extensionMessageString}named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.metaEdName,
          fileMap: null,
        });
      } else {
        this.currentNamespace.entity[this.currentInterchange.type].set(
          this.currentInterchange.metaEdName,
          this.currentInterchange,
        );
      }
    }
    this.currentInterchange = NoInterchange;
  }

  exitInterchange = (_context: InterchangeContext) => {
    this.exitingInterchange();
  };

  exitInterchangeExtension = (_context: InterchangeExtensionContext) => {
    this.exitingInterchange();
  };

  enterInterchangeName = (context: InterchangeNameContext) => {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.currentInterchange.metaEdName = context.ID().getText();
    this.currentInterchange.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterExtendeeName = (context: ExtendeeNameContext) => {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.localExtendeeName() == null) return;

    const localExtendeeNameContext = context.localExtendeeName();
    if (
      localExtendeeNameContext.exception ||
      localExtendeeNameContext.ID() == null ||
      isErrorText(localExtendeeNameContext.ID().getText())
    )
      return;

    this.currentInterchange.metaEdName = localExtendeeNameContext.ID().getText();
    this.currentInterchange.baseEntityName = localExtendeeNameContext.ID().getText();
    this.currentInterchange.sourceMap.metaEdName = sourceMapFrom(localExtendeeNameContext);
    this.currentInterchange.sourceMap.baseEntityName = sourceMapFrom(localExtendeeNameContext);

    const extendeeNamespaceContext = context.extendeeNamespace();
    if (
      extendeeNamespaceContext == null ||
      extendeeNamespaceContext.exception ||
      extendeeNamespaceContext.ID() == null ||
      isErrorText(extendeeNamespaceContext.ID().getText())
    ) {
      this.currentInterchange.baseEntityNamespaceName = this.currentNamespace.namespaceName;
      this.currentInterchange.sourceMap.baseEntityNamespaceName = this.currentInterchange.sourceMap.baseEntityName;
    } else {
      this.currentInterchange.baseEntityNamespaceName = extendeeNamespaceContext.ID().getText();
      this.currentInterchange.sourceMap.baseEntityNamespaceName = sourceMapFrom(extendeeNamespaceContext);
    }
  };

  enterInterchangeElement = (context: InterchangeElementContext) => {
    this.enteringInterchangeItem(context);
  };

  enterInterchangeIdentity = (context: InterchangeIdentityContext) => {
    this.enteringInterchangeItem(context);
  };

  enteringInterchangeItem = (context: InterchangeElementContext | InterchangeIdentityContext) => {
    if (this.currentInterchange === NoInterchange) return;

    if (context.exception || context.localInterchangeItemName() == null) return;
    const localInterchangeItemNameContext = context.localInterchangeItemName();
    if (
      localInterchangeItemNameContext.exception ||
      localInterchangeItemNameContext.ID() == null ||
      isErrorText(localInterchangeItemNameContext.ID().getText())
    )
      return;

    this.currentInterchangeItem = { ...newInterchangeItem(), metaEdName: localInterchangeItemNameContext.ID().getText() };

    Object.assign(this.currentInterchangeItem.sourceMap, {
      type: sourceMapFrom(localInterchangeItemNameContext),
      metaEdName: sourceMapFrom(localInterchangeItemNameContext),
      referencedType: sourceMapFrom(localInterchangeItemNameContext),
    });

    // mutually exclusive in language - spread between interchangeElement and interchangeIdentity
    if (context.ASSOCIATION_KEYWORD && context.ASSOCIATION_KEYWORD()) {
      this.currentInterchangeItem.referencedType = ['association', 'associationSubclass'];
    } else if (context.ASSOCIATION_IDENTITY && context.ASSOCIATION_IDENTITY()) {
      this.currentInterchangeItem.referencedType = ['association', 'associationSubclass'];
    } else if (context.DOMAIN_ENTITY_KEYWORD && context.DOMAIN_ENTITY_KEYWORD()) {
      this.currentInterchangeItem.referencedType = ['domainEntity', 'domainEntitySubclass'];
    } else if (context.DOMAIN_ENTITY_IDENTITY && context.DOMAIN_ENTITY_IDENTITY()) {
      this.currentInterchangeItem.referencedType = ['domainEntity', 'domainEntitySubclass'];
    } else if (context.DESCRIPTOR_KEYWORD && context.DESCRIPTOR_KEYWORD()) {
      this.currentInterchangeItem.referencedType = ['descriptor'];
    } else {
      this.currentInterchangeItem.referencedType = ['unknown'];
    }

    const baseNamespaceContext = context.baseNamespace();
    if (
      baseNamespaceContext == null ||
      baseNamespaceContext.exception ||
      baseNamespaceContext.ID() == null ||
      isErrorText(baseNamespaceContext.ID().getText())
    ) {
      this.currentInterchangeItem.referencedNamespaceName = this.currentNamespace.namespaceName;
      this.currentInterchangeItem.sourceMap.referencedNamespaceName = this.currentInterchangeItem.sourceMap.metaEdName;
    } else {
      this.currentInterchangeItem.referencedNamespaceName = baseNamespaceContext.ID().getText();
      this.currentInterchangeItem.sourceMap.referencedNamespaceName = sourceMapFrom(baseNamespaceContext);
    }
  };

  exitInterchangeElement = (context: InterchangeElementContext) => {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.elements.push(this.currentInterchangeItem);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).elements.push(sourceMapFrom(context));
    this.currentInterchangeItem = NoInterchangeItem;
  };

  exitInterchangeIdentity = (context: InterchangeIdentityContext) => {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.identityTemplates.push(this.currentInterchangeItem);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).identityTemplates.push(sourceMapFrom(context));
    this.currentInterchangeItem = NoInterchangeItem;
  };
}
