// @flow
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

export function entityIdentifier(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return ruleContext.ABSTRACT_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return ruleContext.ASSOCIATION().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    return `${ruleContext.ASSOCIATION().getText()} ${ruleContext.ADDITIONS().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
    return `${ruleContext.ASSOCIATION().getText()} ${ruleContext.BASED_ON().getText()} ${ruleContext.baseName().ID().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choice) return ruleContext.CHOICE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimal) return ruleContext.SHARED_DECIMAL().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedInteger) return ruleContext.SHARED_INTEGER().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShort) return ruleContext.SHARED_SHORT().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedString) return ruleContext.SHARED_STRING().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_common) return ruleContext.COMMON().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonExtension) return ruleContext.COMMON().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return ruleContext.DESCRIPTOR().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return ruleContext.DOMAIN().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return ruleContext.DOMAIN_ENTITY().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
    return `${ruleContext.DOMAIN_ENTITY().getText()} ${ruleContext.ADDITIONS().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
    return `${ruleContext.DOMAIN_ENTITY().getText()} ${ruleContext.BASED_ON().getText()} ${ruleContext.baseName().ID().getText()}`;
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return ruleContext.ENUMERATION().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommon) return ruleContext.INLINE_COMMON().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return ruleContext.INTERCHANGE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return ruleContext.INTERCHANGE().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) {
    return `${ruleContext.SUBDOMAIN().getText()} ${ruleContext.SUBDOMAIN_OF().getText()} ${ruleContext.parentDomainName().ID().getText()}`;
  }
  throw new Error(`RuleInformation.entityIdentifier encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function entityName(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return ruleContext.abstractEntityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return ruleContext.associationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) return ruleContext.extendeeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) return ruleContext.associationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choice) return ruleContext.choiceName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimal) return ruleContext.sharedDecimalName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedInteger) return ruleContext.sharedIntegerName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShort) return ruleContext.sharedShortName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedString) return ruleContext.sharedStringName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_common) return ruleContext.commonName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonExtension) return ruleContext.extendeeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return ruleContext.descriptorName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return ruleContext.domainName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return ruleContext.entityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) return ruleContext.extendeeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) return ruleContext.entityName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return ruleContext.enumerationName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommon) return ruleContext.inlineCommonName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return ruleContext.interchangeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return ruleContext.extendeeName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) return ruleContext.subdomainName().ID().getText();
  throw new Error(`RuleInformation.entityName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function propertyName(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_booleanProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choiceProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_currencyProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_dateProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_decimalProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptorProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_durationProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumerationProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommonProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_integerProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_percentProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimalProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedIntegerProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShortProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedStringProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_shortProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_stringProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_timeProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_yearProperty) return ruleContext.propertyName().ID().getText();
  throw new Error(`RuleInformation.propertyName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function itemName(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainItem) return ruleContext.ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumerationItem) return ruleContext.shortDescription().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeElement) return ruleContext.ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeIdentity) return ruleContext.ID().getText();
  throw new Error(`RuleInformation.itemName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export const topLevelEntityRules: number[] = [
  MetaEdGrammar.RULE_abstractEntity,
  MetaEdGrammar.RULE_association,
  MetaEdGrammar.RULE_associationExtension,
  MetaEdGrammar.RULE_associationSubclass,
  MetaEdGrammar.RULE_choice,
  MetaEdGrammar.RULE_sharedDecimal,
  MetaEdGrammar.RULE_sharedInteger,
  MetaEdGrammar.RULE_sharedShort,
  MetaEdGrammar.RULE_sharedString,
  MetaEdGrammar.RULE_common,
  MetaEdGrammar.RULE_commonExtension,
  MetaEdGrammar.RULE_descriptor,
  MetaEdGrammar.RULE_domain,
  MetaEdGrammar.RULE_domainEntity,
  MetaEdGrammar.RULE_domainEntityExtension,
  MetaEdGrammar.RULE_domainEntitySubclass,
  MetaEdGrammar.RULE_enumeration,
  MetaEdGrammar.RULE_inlineCommon,
  MetaEdGrammar.RULE_interchange,
  MetaEdGrammar.RULE_interchangeExtension,
  MetaEdGrammar.RULE_subdomain,
];

export const topLevelEntityExtensionRules: number[] = [
  MetaEdGrammar.RULE_associationExtension,
  MetaEdGrammar.RULE_commonExtension,
  MetaEdGrammar.RULE_domainEntityExtension,
  MetaEdGrammar.RULE_interchangeExtension,
];

export const propertyRules: number[] = [
  MetaEdGrammar.RULE_associationProperty,
  MetaEdGrammar.RULE_booleanProperty,
  MetaEdGrammar.RULE_choiceProperty,
  MetaEdGrammar.RULE_commonProperty,
  MetaEdGrammar.RULE_currencyProperty,
  MetaEdGrammar.RULE_dateProperty,
  MetaEdGrammar.RULE_decimalProperty,
  MetaEdGrammar.RULE_descriptorProperty,
  MetaEdGrammar.RULE_domainEntityProperty,
  MetaEdGrammar.RULE_durationProperty,
  MetaEdGrammar.RULE_enumerationProperty,
  MetaEdGrammar.RULE_firstDomainEntity,
  MetaEdGrammar.RULE_inlineCommonProperty,
  MetaEdGrammar.RULE_integerProperty,
  MetaEdGrammar.RULE_percentProperty,
  MetaEdGrammar.RULE_secondDomainEntity,
  MetaEdGrammar.RULE_sharedDecimalProperty,
  MetaEdGrammar.RULE_sharedIntegerProperty,
  MetaEdGrammar.RULE_sharedShortProperty,
  MetaEdGrammar.RULE_sharedStringProperty,
  MetaEdGrammar.RULE_shortProperty,
  MetaEdGrammar.RULE_stringProperty,
  MetaEdGrammar.RULE_timeProperty,
  MetaEdGrammar.RULE_yearProperty,
];

export const itemRules: number[] = [
  MetaEdGrammar.RULE_domainItem,
  MetaEdGrammar.RULE_enumerationItem,
  MetaEdGrammar.RULE_interchangeElement,
  MetaEdGrammar.RULE_interchangeIdentity,
];
