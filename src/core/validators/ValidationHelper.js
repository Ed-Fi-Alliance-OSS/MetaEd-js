// @flow
import R from 'ramda';
import grammarInstance from '../../grammar/MetaEdGrammarInstance';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import type SymbolTable from './SymbolTable';
import { topLevelEntityTypes, sharedSimpleEntityTypes } from './SymbolTableEntityType';
import { topLevelEntityRules } from './RuleInformation';
import { propertyRules } from './PropertyInformation';

function getAncestorContextNullable(ruleIndexes: number[], ruleContext: any): any {
  if (R.any(ri => ruleContext.ruleIndex === ri, ruleIndexes)) return ruleContext;
  if (ruleContext.parentCtx === null) return null;
  return getAncestorContextNullable(ruleIndexes, ruleContext.parentCtx);
}

const getAncestorContext = R.curry(
  (ruleIndexes: number[], ruleContext: any): any => {
    const ancestor = getAncestorContextNullable(ruleIndexes, ruleContext);
    if (ancestor === null) {
      throw new Error(`Unable to find matching ancestor on context of type ${grammarInstance.ruleNames[ruleContext.ruleIndex]}`);
    }
    return ancestor;
  });

export const topLevelEntityAncestorContext = getAncestorContext(topLevelEntityRules);
export const propertyAncestorContext = getAncestorContext(propertyRules);
export const namespaceAncestorContext = getAncestorContext([MetaEdGrammar.RULE_namespace]);

export function isExtensionNamespace(namespaceContext: any) {
  return namespaceContext.namespaceType().CORE() == null;
}

export function namespaceNameFor(namespaceContext: any): string {
  return namespaceContext.namespaceName().NAMESPACE_ID().getText();
}

export function propertyNameHandlingSharedProperty(sharedPropertyContext: any): ?any {
  if (sharedPropertyContext.propertyName() && !sharedPropertyContext.propertyName().exception) {
    return sharedPropertyContext.propertyName();
  }

  if (!sharedPropertyContext.propertyName() &&
      sharedPropertyContext.sharedPropertyType() &&
      !sharedPropertyContext.sharedPropertyType().exception) {
    return sharedPropertyContext.sharedPropertyType();
  }

  return null;
}

export function propertyNameStringHandlingSharedProperty(sharedPropertyContext: any): string {
  const propertyNameContext = propertyNameHandlingSharedProperty(sharedPropertyContext);
  if (propertyNameContext) return propertyNameContext.ID().getText();
  return '';
}

export function getProperty(propertyContext: any): any {
  if (propertyContext.associationProperty()) return propertyContext.associationProperty();
  if (propertyContext.booleanProperty()) return propertyContext.booleanProperty();
  if (propertyContext.choiceProperty()) return propertyContext.choiceProperty();
  if (propertyContext.commonProperty()) return propertyContext.commonProperty();
  if (propertyContext.currencyProperty()) return propertyContext.currencyProperty();
  if (propertyContext.dateProperty()) return propertyContext.dateProperty();
  if (propertyContext.decimalProperty()) return propertyContext.decimalProperty();
  if (propertyContext.descriptorProperty()) return propertyContext.descriptorProperty();
  if (propertyContext.domainEntityProperty()) return propertyContext.domainEntityProperty();
  if (propertyContext.durationProperty()) return propertyContext.durationProperty();
  if (propertyContext.enumerationProperty()) return propertyContext.enumerationProperty();
  if (propertyContext.inlineCommonProperty()) return propertyContext.inlineCommonProperty();
  if (propertyContext.integerProperty()) return propertyContext.integerProperty();
  if (propertyContext.percentProperty()) return propertyContext.percentProperty();
  if (propertyContext.sharedDecimalProperty()) return propertyContext.sharedDecimalProperty();
  if (propertyContext.sharedIntegerProperty()) return propertyContext.sharedIntegerProperty();
  if (propertyContext.sharedShortProperty()) return propertyContext.sharedShortProperty();
  if (propertyContext.sharedStringProperty()) return propertyContext.sharedStringProperty();
  if (propertyContext.shortProperty()) return propertyContext.shortProperty();
  if (propertyContext.stringProperty()) return propertyContext.stringProperty();
  if (propertyContext.timeProperty()) return propertyContext.timeProperty();
  if (propertyContext.yearProperty()) return propertyContext.yearProperty();
  throw new Error(`ValidationHelper.getProperty encountered unknown property context with rule index ${propertyContext.ruleIndex}.`);
}

const inSymbolTable = R.curry(
  (entityTypes: string[], identifierToMatch: string, symbolTable: SymbolTable): boolean =>
    R.any((entityType: string) => symbolTable.identifierExists(entityType, identifierToMatch), entityTypes));

const commonSimpleTypeExists = inSymbolTable(sharedSimpleEntityTypes);
const topLevelEntityExists = inSymbolTable(topLevelEntityTypes);

export function contextMustMatchATopLevelEntity(ruleContext: any, symbolTable: SymbolTable): boolean {
  return topLevelEntityExists(ruleContext.ID().getText(), symbolTable);
}

export function propertyMustNotMatchACommonSimpleType(propertyRuleContext: any, symbolTable: SymbolTable): boolean {
  return !commonSimpleTypeExists(propertyRuleContext.propertyName().ID().getText(), symbolTable);
}

// returns list of strings that are duplicated in the original list, with caching
export const findDuplicates = R.memoize(R.compose(R.map(R.head), R.filter(x => x.length > 1), R.values, R.groupBy(R.identity)));

type ScanAccumulator = {
  exception: boolean,
  path: string[],
  ruleContext: any
}

const scanForException = (acc: ScanAccumulator, pathElement: string): ScanAccumulator => {
  if (acc.exception === true) return acc;
  acc.path.push(pathElement);

  if (acc.ruleContext[pathElement] == null || acc.ruleContext[pathElement]() == null) {
    // eslint-disable-next-line no-param-reassign
    acc.exception = true;
    return acc;
  }

  if (acc.ruleContext[pathElement]().exception != null) {
    // eslint-disable-next-line no-param-reassign
    acc.exception = true;
    return acc;
  }

  // eslint-disable-next-line no-param-reassign
  acc.ruleContext = acc.ruleContext[pathElement]();
  return acc;
};

// traverse a rule context path, defined as a string[], looking for an exception
// returns the path to the exception or null
export const exceptionPath = (ruleContextPath: string[], ruleContext: any): ?string[] => {
  if (ruleContext == null || ruleContext.exception != null) return [];

  const result = R.reduce(scanForException, { exception: false, path: [], ruleContext }, ruleContextPath);
  return result.exception ? result.path : null;
};

// returns true if the rule context path is valid for the given rule context
export const validPath =
  (ruleContextPath: string[], ruleContext: any): boolean => exceptionPath(ruleContextPath, ruleContext) === null;

export function entityIdentifierExceptionPath(ruleContext: any): ?string[] {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return exceptionPath(['ABSTRACT_ENTITY'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return exceptionPath(['ASSOCIATION'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    const associationPath = exceptionPath(['ASSOCIATION'], ruleContext);
    if (associationPath) return associationPath;
    return exceptionPath(['ADDITIONS'], ruleContext);
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
    const associationPath = exceptionPath(['ASSOCIATION'], ruleContext);
    if (associationPath) return associationPath;

    const basedOnPath = exceptionPath(['BASED_ON'], ruleContext);
    if (basedOnPath) return basedOnPath;

    return exceptionPath(['baseName', 'ID'], ruleContext);
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choice) return exceptionPath(['CHOICE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimal) return exceptionPath(['SHARED_DECIMAL'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedInteger) return exceptionPath(['SHARED_INTEGER'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShort) return exceptionPath(['SHARED_SHORT'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedString) return exceptionPath(['SHARED_STRING'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_common) return exceptionPath(['COMMON'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonExtension) return exceptionPath(['COMMON'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return exceptionPath(['DESCRIPTOR'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return exceptionPath(['DOMAIN'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return exceptionPath(['DOMAIN_ENTITY'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
    const domainEntityPath = exceptionPath(['DOMAIN_ENTITY'], ruleContext);
    if (domainEntityPath) return domainEntityPath;
    return exceptionPath(['ADDITIONS'], ruleContext);
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
    const domainEntityPath = exceptionPath(['DOMAIN_ENTITY'], ruleContext);
    if (domainEntityPath) return domainEntityPath;

    const basedOnPath = exceptionPath(['BASED_ON'], ruleContext);
    if (basedOnPath) return basedOnPath;

    return exceptionPath(['baseName', 'ID'], ruleContext);
  }
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return exceptionPath(['ENUMERATION'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommon) return exceptionPath(['INLINE_COMMON'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return exceptionPath(['INTERCHANGE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return exceptionPath(['INTERCHANGE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) {
    const subdomainPath = exceptionPath(['SUBDOMAIN'], ruleContext);
    if (subdomainPath) return subdomainPath;

    const subdomainOfPath = exceptionPath(['SUBDOMAIN_OF'], ruleContext);
    if (subdomainOfPath) return subdomainOfPath;

    return exceptionPath(['parentDomainName', 'ID'], ruleContext);
  }
  throw new Error(`ValidationHelper.entityIdentifierExceptionPath encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function entityNameExceptionPath(ruleContext: any): ?string[] {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) return exceptionPath(['abstractEntityName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_association) return exceptionPath(['associationName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) return exceptionPath(['associationName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choice) return exceptionPath(['choiceName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimal) return exceptionPath(['sharedDecimalName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedInteger) return exceptionPath(['sharedIntegerName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShort) return exceptionPath(['sharedShortName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedString) return exceptionPath(['sharedStringName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_common) return exceptionPath(['commonName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return exceptionPath(['descriptorName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return exceptionPath(['domainName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return exceptionPath(['entityName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) return exceptionPath(['entityName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return exceptionPath(['enumerationName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommon) return exceptionPath(['inlineCommonName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return exceptionPath(['interchangeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) return exceptionPath(['subdomainName', 'ID'], ruleContext);
  throw new Error(`ValidationHelper.entityNameExceptionPath encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function itemNameExceptionPath(ruleContext: any): ?string[] {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainItem) return exceptionPath(['ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumerationItem) return exceptionPath(['shortDescription'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeElement) return exceptionPath(['ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeIdentity) return exceptionPath(['ID'], ruleContext);
  throw new Error(`RuleInformation.itemName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

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
  throw new Error(`ValidationHelper.entityIdentifier encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
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
  throw new Error(`ValidationHelper.entityName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
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
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimalProperty) return propertyNameStringHandlingSharedProperty(ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedIntegerProperty) return propertyNameStringHandlingSharedProperty(ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShortProperty) return propertyNameStringHandlingSharedProperty(ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedStringProperty) return propertyNameStringHandlingSharedProperty(ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_shortProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_stringProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_timeProperty) return ruleContext.propertyName().ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_yearProperty) return ruleContext.propertyName().ID().getText();
  throw new Error(`ValidationHelper.propertyName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function itemName(ruleContext: any): string {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainItem) return ruleContext.ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumerationItem) return ruleContext.shortDescription().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeElement) return ruleContext.ID().getText();
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeIdentity) return ruleContext.ID().getText();
  throw new Error(`ValidationHelper.itemName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export const getPropertyThenPropertyName = R.pipe(getProperty, propertyName);
