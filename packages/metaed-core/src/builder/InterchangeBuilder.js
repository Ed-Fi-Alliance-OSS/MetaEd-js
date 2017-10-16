// @flow
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import type { Interchange, InterchangeSourceMap } from '../model/Interchange';
import type { InterchangeItem } from '../model/InterchangeItem';
import type { EntityRepository } from '../model/EntityRepository';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';

import { newInterchange, NoInterchange } from '../model/Interchange';
import { newInterchangeItem, NoInterchangeItem } from '../model/InterchangeItem';
import { newInterchangeExtension } from '../model/InterchangeExtension';
import { newNamespaceInfo, NoNamespaceInfo } from '../model/NamespaceInfo';
import { enteringNamespaceName, enteringNamespaceType } from './NamespaceInfoBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';
import type { ValidationFailure } from '../validator/ValidationFailure';

export class InterchangeBuilder extends MetaEdGrammarListener {
  entityRepository: EntityRepository;
  namespaceInfo: NamespaceInfo;
  currentInterchange: Interchange;
  currentInterchangeItem: InterchangeItem;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.entityRepository = metaEd.entity;
    this.namespaceInfo = NoNamespaceInfo;
    this.currentInterchange = NoInterchange;
    this.currentInterchangeItem = NoInterchangeItem;
    this.validationFailures = validationFailures;
  }

  enterNamespace(context: MetaEdGrammar.NamespaceContext) {
    if (this.namespaceInfo !== NoNamespaceInfo) return;
    this.namespaceInfo = newNamespaceInfo();
    this.namespaceInfo.sourceMap.type = sourceMapFrom(context);
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.namespaceInfo = enteringNamespaceName(context, this.namespaceInfo);
  }

  enterNamespaceType(context: MetaEdGrammar.NamespaceTypeContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.namespaceInfo = enteringNamespaceType(context, this.namespaceInfo);
  }

  // eslint-disable-next-line no-unused-vars
  exitNamespace(context: MetaEdGrammar.NamespaceContext) {
    this.namespaceInfo = NoNamespaceInfo;
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.documentation = extractDocumentation(context);
    this.currentInterchange.sourceMap.documentation = sourceMapFrom(context);
  }

  enterExtendedDocumentation(context: MetaEdGrammar.ExtendedDocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.extendedDocumentation = extractDocumentation(context);
    ((this.currentInterchange.sourceMap: any): InterchangeSourceMap).extendedDocumentation = sourceMapFrom(context);
  }

  enterUseCaseDocumentation(context: MetaEdGrammar.UseCaseDocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.useCaseDocumentation = extractDocumentation(context);
    ((this.currentInterchange.sourceMap: any): InterchangeSourceMap).useCaseDocumentation = sourceMapFrom(context);
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.METAED_ID() == null || context.METAED_ID().exception != null || isErrorText(context.METAED_ID().getText())) return;

    if (this.currentInterchangeItem !== NoInterchangeItem) {
      this.currentInterchangeItem.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentInterchangeItem.sourceMap.metaEdId = sourceMapFrom(context);
    } else {
      this.currentInterchange.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentInterchange.sourceMap.metaEdId = sourceMapFrom(context);
    }
  }
  enterInterchange(context: MetaEdGrammar.InterchangeContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.currentInterchange = Object.assign(newInterchange(), {
      namespaceInfo: this.namespaceInfo,
    });
    Object.assign(this.currentInterchange.sourceMap, {
      type: sourceMapFrom(context),
      namespaceInfo: this.currentInterchange.namespaceInfo.sourceMap.type,
    });
  }

  enterInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.currentInterchange = Object.assign(newInterchangeExtension(), {
      namespaceInfo: this.namespaceInfo,
    });
    this.currentInterchange.sourceMap.type = sourceMapFrom(context);
  }

  exitingInterchange() {
    if (this.currentInterchange === NoInterchange) return;
    if (this.currentInterchange.metaEdName) {
      const extensionMessageString = this.currentInterchange.type === 'interchangeExtension' ? 'Extension ' : '';
      // $FlowIgnore - allow currentInterchange.type to specify the entityRepository Map property
      if (this.entityRepository[this.currentInterchange.type].has(this.currentInterchange.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'InterchangeBuilder',
          category: 'error',
          message: `Interchange ${extensionMessageString}named ${this.currentInterchange.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentInterchange.sourceMap.type,
          fileMap: null,
        });
        // $FlowIgnore - we ensure the key is in the map above, and allow currentInterchange.type to specify the entityRepository Map property
        const duplicateEntity: Interchange = this.entityRepository[this.currentInterchange.type].get(this.currentInterchange.metaEdName);
        this.validationFailures.push({
          validatorName: 'InterchangeBuilder',
          category: 'error',
          message: `Interchange ${extensionMessageString}named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.type,
          fileMap: null,
        });
      } else {
        // $FlowIgnore - allow currentInterchange.type to specify the entityRepository Map property
        this.entityRepository[this.currentInterchange.type].set(this.currentInterchange.metaEdName, this.currentInterchange);
      }
    }
    this.currentInterchange = NoInterchange;
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchange(context: MetaEdGrammar.InterchangeContext) {
    this.exitingInterchange();
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext) {
    this.exitingInterchange();
  }

  enterInterchangeName(context: MetaEdGrammar.InterchangeNameContext) {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentInterchange.metaEdName = context.ID().getText();
    this.currentInterchange.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterExtendeeName(context: MetaEdGrammar.ExtendeeNameContext) {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentInterchange.metaEdName = context.ID().getText();
    this.currentInterchange.baseEntityName = context.ID().getText();
    this.currentInterchange.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterInterchangeElement(context: MetaEdGrammar.InterchangeElementContext) {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentInterchangeItem = Object.assign(newInterchangeItem(), { metaEdName: context.ID().getText() });
    Object.assign(this.currentInterchangeItem.sourceMap, {
      type: sourceMapFrom(context),
      metaEdName: sourceMapFrom(context),
      referencedType: sourceMapFrom(context),
    });

    // mutually exclusive in language
    if (context.ASSOCIATION_KEYWORD()) this.currentInterchangeItem.referencedType = ['association', 'associationSubclass'];
    if (context.DOMAIN_ENTITY_KEYWORD()) this.currentInterchangeItem.referencedType = ['domainEntity', 'domainEntitySubclass'];
    if (context.DESCRIPTOR_KEYWORD()) this.currentInterchangeItem.referencedType = ['descriptor'];
    ((this.currentInterchange.sourceMap: any): InterchangeSourceMap).elements.push(sourceMapFrom(context));
  }

  enterInterchangeIdentity(context: MetaEdGrammar.InterchangeIdentityContext) {
    if (this.currentInterchange === NoInterchange) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentInterchangeItem = Object.assign(newInterchangeItem(), { metaEdName: context.ID().getText() });
    Object.assign(this.currentInterchangeItem.sourceMap, {
      type: sourceMapFrom(context),
      metaEdName: sourceMapFrom(context),
      referencedType: sourceMapFrom(context),
    });

    // mutually exclusive in language
    if (context.ASSOCIATION_IDENTITY()) this.currentInterchangeItem.referencedType = ['association', 'associationSubclass'];
    if (context.DOMAIN_ENTITY_IDENTITY()) this.currentInterchangeItem.referencedType = ['domainEntity', 'domainEntitySubclass'];
    ((this.currentInterchange.sourceMap: any): InterchangeSourceMap).identityTemplates.push(sourceMapFrom(context));
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchangeElement(context: MetaEdGrammar.InterchangeElementContext) {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.elements.push(this.currentInterchangeItem);
    this.currentInterchangeItem = NoInterchangeItem;
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchangeIdentity(context: MetaEdGrammar.InterchangeIdentityContext) {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.identityTemplates.push(this.currentInterchangeItem);
    this.currentInterchangeItem = NoInterchangeItem;
  }
}
