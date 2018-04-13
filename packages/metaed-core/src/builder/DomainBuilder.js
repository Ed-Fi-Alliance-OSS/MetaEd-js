// @flow

import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import type { Domain, DomainSourceMap } from '../model/Domain';
import type { Subdomain, SubdomainSourceMap } from '../model/Subdomain';
import type { DomainItem, DomainItemSourceMap } from '../model/DomainItem';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';
import { newDomainItem, NoDomainItem } from '../model/DomainItem';
import { newDomain, NoDomain } from '../model/Domain';
import { newSubdomain } from '../model/Subdomain';
import { namespaceName } from './NamespaceInfoBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText } from './BuilderUtility';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { sourceMapFrom } from '../model/SourceMap';

export class DomainBuilder extends MetaEdGrammarListener {
  metaEd: MetaEdEnvironment;
  currentNamespace: string;
  currentDomain: Domain | Subdomain;
  currentDomainItem: DomainItem;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.metaEd = metaEd;
    this.currentNamespace = '';
    this.currentDomain = NoDomain;
    this.currentDomainItem = NoDomainItem;
    this.validationFailures = validationFailures;
  }

  getNamespaceInfo(): ?NamespaceInfo {
    return this.metaEd.entity.namespaceInfo.get(this.currentNamespace);
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    this.currentNamespace = namespaceName(context);
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentDomain === NoDomain) return;
    this.currentDomain.documentation = extractDocumentation(context);
    this.currentDomain.sourceMap.documentation = sourceMapFrom(context);
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (this.currentDomain === NoDomain) return;
    if (
      context.exception ||
      context.METAED_ID() == null ||
      context.METAED_ID().exception != null ||
      isErrorText(context.METAED_ID().getText())
    )
      return;

    if (this.currentDomainItem !== NoDomainItem) {
      this.currentDomainItem.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentDomainItem.sourceMap.metaEdId = sourceMapFrom(context);
    } else {
      this.currentDomain.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentDomain.sourceMap.metaEdId = sourceMapFrom(context);
    }
  }

  enterDomain(context: MetaEdGrammar.DomainContext) {
    const namespaceInfo = this.getNamespaceInfo();
    if (namespaceInfo == null) return;
    this.currentDomain = { ...newDomain(), namespaceInfo };
    this.currentDomain.sourceMap.type = sourceMapFrom(context);
    this.currentDomain.sourceMap.namespaceInfo = namespaceInfo.sourceMap.type;
  }

  enterSubdomain(context: MetaEdGrammar.SubdomainContext) {
    const namespaceInfo = this.getNamespaceInfo();
    if (namespaceInfo == null) return;
    this.currentDomain = { ...newSubdomain(), namespaceInfo };
    this.currentDomain.sourceMap.type = sourceMapFrom(context);
    this.currentDomain.sourceMap.namespaceInfo = namespaceInfo.sourceMap.type;
  }

  exitingEntity() {
    if (this.currentDomain === NoDomain) return;
    // $FlowIgnore
    const currentDomainRepository = this.metaEd.entity[this.currentDomain.type];
    if (this.currentDomain.metaEdName) {
      if (currentDomainRepository.has(this.currentDomain.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'DomainBuilder',
          category: 'error',
          message: `${this.currentDomain.typeHumanizedName} named ${
            this.currentDomain.metaEdName
          } is a duplicate declaration of that name.`,
          sourceMap: this.currentDomain.sourceMap.type,
          fileMap: null,
        });
        const duplicateEntity: Domain | Subdomain = currentDomainRepository.get(this.currentDomain.metaEdName);
        this.validationFailures.push({
          validatorName: 'DomainBuilder',
          category: 'error',
          message: `${duplicateEntity.typeHumanizedName} named ${
            duplicateEntity.metaEdName
          } is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.type,
          fileMap: null,
        });
      } else {
        currentDomainRepository.set(this.currentDomain.metaEdName, this.currentDomain);
      }
    }

    this.currentDomain = NoDomain;
  }

  // eslint-disable-next-line no-unused-vars
  exitDomain(context: MetaEdGrammar.DomainContext) {
    this.exitingEntity();
  }

  // eslint-disable-next-line no-unused-vars
  exitSubdomain(context: MetaEdGrammar.DomainContext) {
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
    ((this.currentDomain: any): Subdomain).parentMetaEdName = context.ID().getText();
    ((this.currentDomain.sourceMap: any): SubdomainSourceMap).parent = sourceMapFrom(context);
    ((this.currentDomain.sourceMap: any): SubdomainSourceMap).parentMetaEdName = sourceMapFrom(context);
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
    ((this.currentDomain: any): Subdomain).position = Number(context.UNSIGNED_INT().getText());
    ((this.currentDomain.sourceMap: any): SubdomainSourceMap).position = sourceMapFrom(context);
  }

  enterDomainItem(context: MetaEdGrammar.DomainItemContext) {
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentDomainItem = Object.assign(newDomainItem(), { metaEdName: context.ID().getText() });
    ((this.currentDomainItem.sourceMap: any): DomainItemSourceMap).metaEdName = sourceMapFrom(context);
    ((this.currentDomainItem.sourceMap: any): DomainItemSourceMap).referencedType = sourceMapFrom(context);
    ((this.currentDomainItem.sourceMap: any): DomainItemSourceMap).type = sourceMapFrom(context);

    // mutually exclusive in language
    if (context.ASSOCIATION_KEYWORD()) this.currentDomainItem.referencedType = 'association';
    if (context.COMMON_KEYWORD()) this.currentDomainItem.referencedType = 'common';
    if (context.DOMAIN_ENTITY_KEYWORD()) this.currentDomainItem.referencedType = 'domainEntity';
    if (context.DESCRIPTOR_KEYWORD()) this.currentDomainItem.referencedType = 'descriptor';
    if (context.INLINE_COMMON_KEYWORD()) this.currentDomainItem.referencedType = 'inlineCommon';
  }

  exitDomainItem(context: MetaEdGrammar.DomainItemContext) {
    if (this.currentDomain === NoDomain || this.currentDomainItem === NoDomainItem) return;
    ((this.currentDomain.sourceMap: any): DomainSourceMap).domainItems.push(sourceMapFrom(context));
    this.currentDomain.domainItems.push(this.currentDomainItem);
    this.currentDomainItem = NoDomainItem;
  }

  enterFooterDocumentation(context: MetaEdGrammar.FooterDocumentationContext) {
    if (this.currentDomain === NoDomain) return;
    ((this.currentDomain: any): Domain).footerDocumentation = extractDocumentation(context);
    ((this.currentDomain.sourceMap: any): DomainSourceMap).footerDocumentation = sourceMapFrom(context);
  }
}
