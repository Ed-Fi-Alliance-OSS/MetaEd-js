// @flow
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';

export function entityIdentifier(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return ruleContext.ABSTRACT_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return ruleContext.ASSOCIATION().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) return ruleContext.ASSOCIATION().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
    return `${ruleContext.ASSOCIATION().getText()} ${ruleContext.BASED_ON().getText()} ${ruleContext.baseName().ID().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choiceType) return ruleContext.CHOICE_TYPE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonDecimal) return ruleContext.COMMON_DECIMAL().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonInteger) return ruleContext.COMMON_INTEGER().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonShort) return ruleContext.COMMON_SHORT().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonString) return ruleContext.COMMON_STRING().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonType) return ruleContext.COMMON_TYPE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonTypeExtension) return ruleContext.COMMON_TYPE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return ruleContext.DESCRIPTOR_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return ruleContext.DOMAIN().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return ruleContext.DOMAIN_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) return ruleContext.DOMAIN_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
    return `${ruleContext.DOMAIN_ENTITY().getText()} ${ruleContext.BASED_ON().getText()} ${ruleContext.baseName().ID().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return ruleContext.ENUMERATION_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommonType) return ruleContext.INLINE_COMMON_TYPE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return ruleContext.INTERCHANGE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return ruleContext.INTERCHANGE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) {
    return `${ruleContext.SUBDOMAIN().getText()} ${ruleContext.SUBDOMAIN_OF().getText()} ${ruleContext.parentDomainName().ID().getText()}`;
  }
  throw new Error(`TopLevelEntityInformation.entityIdentifier encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function entityName(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return ruleContext.abstractEntityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return ruleContext.associationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) return ruleContext.associationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) return ruleContext.associationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choiceType) return ruleContext.choiceName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonDecimal) return ruleContext.commonDecimalName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonInteger) return ruleContext.commonIntegerName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonShort) return ruleContext.commonShortName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonString) return ruleContext.commonStringName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonType) return ruleContext.commonName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonTypeExtension) return ruleContext.commonName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return ruleContext.descriptorName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return ruleContext.domainName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return ruleContext.entityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) return ruleContext.entityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) return ruleContext.entityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return ruleContext.enumerationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommonType) return ruleContext.inlineCommonName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return ruleContext.interchangeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return ruleContext.interchangeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) return ruleContext.subdomainName().ID().getText();
  throw new Error(`TopLevelEntityInformation.entityName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export const topLevelEntityRules: number[] =
  [
    MetaEdGrammar.RULE_abstractEntity,
    MetaEdGrammar.RULE_association,
    MetaEdGrammar.RULE_associationExtension,
    MetaEdGrammar.RULE_associationSubclass,
    MetaEdGrammar.RULE_choiceType,
    MetaEdGrammar.RULE_commonDecimal,
    MetaEdGrammar.RULE_commonInteger,
    MetaEdGrammar.RULE_commonShort,
    MetaEdGrammar.RULE_commonString,
    MetaEdGrammar.RULE_commonType,
    MetaEdGrammar.RULE_commonTypeExtension,
    MetaEdGrammar.RULE_descriptor,
    MetaEdGrammar.RULE_domain,
    MetaEdGrammar.RULE_domainEntity,
    MetaEdGrammar.RULE_domainEntityExtension,
    MetaEdGrammar.RULE_domainEntitySubclass,
    MetaEdGrammar.RULE_enumeration,
    MetaEdGrammar.RULE_inlineCommonType,
    MetaEdGrammar.RULE_interchange,
    MetaEdGrammar.RULE_interchangeExtension,
    MetaEdGrammar.RULE_subdomain,
  ];
