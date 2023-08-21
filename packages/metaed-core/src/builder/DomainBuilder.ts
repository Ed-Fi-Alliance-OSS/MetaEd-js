import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import { Domain, DomainSourceMap } from '../model/Domain';
import { Subdomain, SubdomainSourceMap } from '../model/Subdomain';
import { DomainItem } from '../model/DomainItem';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { NoNamespace } from '../model/Namespace';
import { newDomainItem, NoDomainItem } from '../model/DomainItem';
import { newDomain, NoDomain } from '../model/Domain';
import { newSubdomain } from '../model/Subdomain';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, extractDeprecationReason, isErrorText } from './BuilderUtility';
import { ValidationFailure } from '../validator/ValidationFailure';
import { sourceMapFrom } from '../model/SourceMap';
import { TopLevelEntity } from '../model/TopLevelEntity';

/**
 * An ANTLR4 listener that creates Domain (not DomainEntity!) entities.
 */
export class DomainBuilder extends MetaEdGrammarListener {
  metaEd: MetaEdEnvironment;

  currentNamespace: Namespace;

  currentDomain: Domain | Subdomain;

  currentDomainItem: DomainItem;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.currentNamespace = NoNamespace;
    this.currentDomain = NoDomain;
    this.currentDomainItem = NoDomainItem;
    this.validationFailures = validationFailures;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  enterDeprecated(context: MetaEdGrammar.DeprecatedContext) {
    if (this.currentDomain === NoDomain) return;

    if (!context.exception) {
      this.currentDomain.isDeprecated = true;
      this.currentDomain.deprecationReason = extractDeprecationReason(context);
      this.currentDomain.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentDomain.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentDomain === NoDomain) return;
    this.currentDomain.documentation = extractDocumentation(context);
    this.currentDomain.sourceMap.documentation = sourceMapFrom(context);
  }

  enterDomain(context: MetaEdGrammar.DomainContext) {
    this.currentDomain = { ...newDomain(), namespace: this.currentNamespace };
    this.currentDomain.sourceMap.type = sourceMapFrom(context);
  }

  enterSubdomain(context: MetaEdGrammar.SubdomainContext) {
    this.currentDomain = { ...newSubdomain(), namespace: this.currentNamespace };
    this.currentDomain.sourceMap.type = sourceMapFrom(context);
  }

  exitingEntity() {
    if (this.currentDomain === NoDomain) return;

    const currentDomainRepository: Map<string, TopLevelEntity> = this.currentNamespace.entity[this.currentDomain.type];
    if (this.currentDomain.metaEdName) {
      if (currentDomainRepository.has(this.currentDomain.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'DomainBuilder',
          category: 'error',
          message: `${this.currentDomain.typeHumanizedName} named ${this.currentDomain.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentDomain.sourceMap.metaEdName,
          fileMap: null,
        });
        const duplicateEntity: any = currentDomainRepository.get(this.currentDomain.metaEdName);
        this.validationFailures.push({
          validatorName: 'DomainBuilder',
          category: 'error',
          message: `${duplicateEntity.typeHumanizedName} named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.metaEdName,
          fileMap: null,
        });
      } else {
        currentDomainRepository.set(this.currentDomain.metaEdName, this.currentDomain);
      }
    }

    this.currentDomain = NoDomain;
  }

  exitDomain(_context: MetaEdGrammar.DomainContext) {
    this.exitingEntity();
  }

  exitSubdomain(_context: MetaEdGrammar.DomainContext) {
    this.exitingEntity();
  }

  enterDomainName(context: MetaEdGrammar.DomainNameContext) {
    if (this.currentDomain === NoDomain) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentDomain.metaEdName = context.ID().getText();
    this.currentDomain.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterSubdomainName(context: MetaEdGrammar.SubdomainNameContext) {
    if (this.currentDomain === NoDomain) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentDomain.metaEdName = context.ID().getText();
    this.currentDomain.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterParentDomainName(context: MetaEdGrammar.ParentDomainNameContext) {
    if (this.currentDomain === NoDomain) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    (this.currentDomain as Subdomain).parentMetaEdName = context.ID().getText();
    (this.currentDomain.sourceMap as SubdomainSourceMap).parent = sourceMapFrom(context);
    (this.currentDomain.sourceMap as SubdomainSourceMap).parentMetaEdName = sourceMapFrom(context);
  }

  enterSubdomainPosition(context: MetaEdGrammar.SubdomainPositionContext) {
    if (this.currentDomain === NoDomain) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentDomain as Subdomain).position = Number(context.UNSIGNED_INT().getText());
    (this.currentDomain.sourceMap as SubdomainSourceMap).position = sourceMapFrom(context);
  }

  enterDomainItem(context: MetaEdGrammar.DomainItemContext) {
    if (this.currentDomain === NoDomain) return;

    if (context.exception || context.localDomainItemName() == null) return;
    const localDomainItemNameContext = context.localDomainItemName();
    if (
      localDomainItemNameContext.exception ||
      localDomainItemNameContext.ID() == null ||
      localDomainItemNameContext.ID().exception ||
      isErrorText(localDomainItemNameContext.ID().getText())
    )
      return;

    this.currentDomainItem = {
      ...newDomainItem(),
      metaEdName: localDomainItemNameContext.ID().getText(),
      namespace: this.currentDomain.namespace,
    };

    Object.assign(this.currentDomainItem.sourceMap, {
      type: sourceMapFrom(localDomainItemNameContext),
      metaEdName: sourceMapFrom(localDomainItemNameContext),
      referencedType: sourceMapFrom(localDomainItemNameContext),
    });

    // mutually exclusive in language
    if (context.ASSOCIATION_KEYWORD()) this.currentDomainItem.referencedType = 'association';
    if (context.COMMON_KEYWORD()) this.currentDomainItem.referencedType = 'common';
    if (context.DOMAIN_ENTITY_KEYWORD()) this.currentDomainItem.referencedType = 'domainEntity';
    if (context.DESCRIPTOR_KEYWORD()) this.currentDomainItem.referencedType = 'descriptor';
    if (context.INLINE_COMMON_KEYWORD()) this.currentDomainItem.referencedType = 'inlineCommon';

    const baseNamespaceContext = context.baseNamespace();
    if (
      baseNamespaceContext == null ||
      baseNamespaceContext.exception ||
      baseNamespaceContext.ID() == null ||
      baseNamespaceContext.ID().exception ||
      isErrorText(baseNamespaceContext.ID().getText())
    ) {
      this.currentDomainItem.referencedNamespaceName = this.currentNamespace.namespaceName;
      this.currentDomainItem.sourceMap.referencedNamespaceName = this.currentDomainItem.sourceMap.metaEdName;
    } else {
      this.currentDomainItem.referencedNamespaceName = baseNamespaceContext.ID().getText();
      this.currentDomainItem.sourceMap.referencedNamespaceName = sourceMapFrom(baseNamespaceContext);
    }
  }

  exitDomainItem(context: MetaEdGrammar.DomainItemContext) {
    if (this.currentDomain === NoDomain || this.currentDomainItem === NoDomainItem) return;
    (this.currentDomain.sourceMap as DomainSourceMap).domainItems.push(sourceMapFrom(context));
    this.currentDomain.domainItems.push(this.currentDomainItem);
    this.currentDomainItem = NoDomainItem;
  }

  enterFooterDocumentation(context: MetaEdGrammar.FooterDocumentationContext) {
    if (this.currentDomain === NoDomain) return;
    (this.currentDomain as Domain).footerDocumentation = extractDocumentation(context);
    (this.currentDomain.sourceMap as DomainSourceMap).footerDocumentation = sourceMapFrom(context);
  }
}
