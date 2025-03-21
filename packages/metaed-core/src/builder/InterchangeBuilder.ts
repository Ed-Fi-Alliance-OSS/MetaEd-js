// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

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
import { extractDocumentation, isErrorText, extractDeprecationReason } from './BuilderUtility';
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

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  enterDeprecated(context: MetaEdGrammar.DeprecatedContext) {
    if (this.currentInterchange === NoInterchange) return;

    if (!context.exception) {
      this.currentInterchange.isDeprecated = true;
      this.currentInterchange.deprecationReason = extractDeprecationReason(context);
      this.currentInterchange.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentInterchange.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.documentation = extractDocumentation(context);
    this.currentInterchange.sourceMap.documentation = sourceMapFrom(context);
  }

  enterExtendedDocumentation(context: MetaEdGrammar.ExtendedDocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.extendedDocumentation = extractDocumentation(context);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).extendedDocumentation = sourceMapFrom(context);
  }

  enterUseCaseDocumentation(context: MetaEdGrammar.UseCaseDocumentationContext) {
    if (this.currentInterchange === NoInterchange) return;
    this.currentInterchange.useCaseDocumentation = extractDocumentation(context);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).useCaseDocumentation = sourceMapFrom(context);
  }

  enterInterchange(context: MetaEdGrammar.InterchangeContext) {
    this.currentInterchange = { ...newInterchange(), namespace: this.currentNamespace };

    Object.assign(this.currentInterchange.sourceMap, {
      type: sourceMapFrom(context),
    });
  }

  enterInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext) {
    this.currentInterchange = { ...newInterchangeExtension(), namespace: this.currentNamespace };
    this.currentInterchange.sourceMap.type = sourceMapFrom(context);
  }

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

  exitInterchange(_context: MetaEdGrammar.InterchangeContext) {
    this.exitingInterchange();
  }

  exitInterchangeExtension(_context: MetaEdGrammar.InterchangeExtensionContext) {
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
    if (context.exception || context.localExtendeeName() == null) return;

    const localExtendeeNameContext = context.localExtendeeName();
    if (
      localExtendeeNameContext.exception ||
      localExtendeeNameContext.ID() == null ||
      localExtendeeNameContext.ID().exception ||
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
      extendeeNamespaceContext.ID().exception ||
      isErrorText(extendeeNamespaceContext.ID().getText())
    ) {
      this.currentInterchange.baseEntityNamespaceName = this.currentNamespace.namespaceName;
      this.currentInterchange.sourceMap.baseEntityNamespaceName = this.currentInterchange.sourceMap.baseEntityName;
    } else {
      this.currentInterchange.baseEntityNamespaceName = extendeeNamespaceContext.ID().getText();
      this.currentInterchange.sourceMap.baseEntityNamespaceName = sourceMapFrom(extendeeNamespaceContext);
    }
  }

  enterInterchangeElement(context: MetaEdGrammar.InterchangeElementContext) {
    this.enteringInterchangeItem(context);
  }

  enterInterchangeIdentity(context: MetaEdGrammar.InterchangeIdentityContext) {
    this.enteringInterchangeItem(context);
  }

  enteringInterchangeItem(context: MetaEdGrammar.InterchangeElementContext | MetaEdGrammar.InterchangeIdentityContext) {
    if (this.currentInterchange === NoInterchange) return;

    if (context.exception || context.localInterchangeItemName() == null) return;
    const localInterchangeItemNameContext = context.localInterchangeItemName();
    if (
      localInterchangeItemNameContext.exception ||
      localInterchangeItemNameContext.ID() == null ||
      localInterchangeItemNameContext.ID().exception ||
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
      baseNamespaceContext.ID().exception ||
      isErrorText(baseNamespaceContext.ID().getText())
    ) {
      this.currentInterchangeItem.referencedNamespaceName = this.currentNamespace.namespaceName;
      this.currentInterchangeItem.sourceMap.referencedNamespaceName = this.currentInterchangeItem.sourceMap.metaEdName;
    } else {
      this.currentInterchangeItem.referencedNamespaceName = baseNamespaceContext.ID().getText();
      this.currentInterchangeItem.sourceMap.referencedNamespaceName = sourceMapFrom(baseNamespaceContext);
    }
  }

  exitInterchangeElement(context: MetaEdGrammar.InterchangeElementContext) {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.elements.push(this.currentInterchangeItem);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).elements.push(sourceMapFrom(context));
    this.currentInterchangeItem = NoInterchangeItem;
  }

  exitInterchangeIdentity(context: MetaEdGrammar.InterchangeIdentityContext) {
    if (this.currentInterchange === NoInterchange || this.currentInterchangeItem === NoInterchangeItem) return;
    this.currentInterchange.identityTemplates.push(this.currentInterchangeItem);
    (this.currentInterchange.sourceMap as InterchangeSourceMap).identityTemplates.push(sourceMapFrom(context));
    this.currentInterchangeItem = NoInterchangeItem;
  }
}
