// @flow
import R from 'ramda';
import { Record, List } from 'immutable';
import grammarInstance from '../../grammar/MetaEdGrammarInstance';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import type SymbolTable from './SymbolTable';
import { topLevelEntityTypes, commonSimpleEntityTypes } from './SymbolTableEntityType';
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
  return namespaceContext.namespaceType().namespaceProjectExtension() !== null;
}

export function namespaceNameFor(namespaceContext: any): string {
  return namespaceContext.namespaceName().NAMESPACE_ID().getText();
}

export function getProperty(propertyContext: any): any {
  if (propertyContext.booleanProperty()) return propertyContext.booleanProperty();
  if (propertyContext.currencyProperty()) return propertyContext.currencyProperty();
  if (propertyContext.dateProperty()) return propertyContext.dateProperty();
  if (propertyContext.decimalProperty()) return propertyContext.decimalProperty();
  if (propertyContext.descriptorProperty()) return propertyContext.descriptorProperty();
  if (propertyContext.durationProperty()) return propertyContext.durationProperty();
  if (propertyContext.enumerationProperty()) return propertyContext.enumerationProperty();
  if (propertyContext.includeProperty()) return propertyContext.includeProperty();
  if (propertyContext.integerProperty()) return propertyContext.integerProperty();
  if (propertyContext.percentProperty()) return propertyContext.percentProperty();
  if (propertyContext.referenceProperty()) return propertyContext.referenceProperty();
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

const commonSimpleTypeExists = inSymbolTable(commonSimpleEntityTypes);
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
  path: List<string>,
  ruleContext: any
}

const scanForException = (acc: Record<ScanAccumulator>, pathElement: string): Record<ScanAccumulator> => {
  if (acc.get('exception') === true) return acc;
  acc.set('path', acc.get('path').push(pathElement));

  if (acc.get('ruleContext')[pathElement] == null || acc.get('ruleContext')[pathElement]() == null) {
    return acc.set('exception', true);
  }

  if (acc.get('ruleContext')[pathElement]().exception != null) {
    return acc.set('exception', true);
  }

  return acc.set('ruleContext', acc.get('ruleContext')[pathElement]());
};

// traverse a rule context path, defined as a string[], looking for an exception
// returns the path to the exception or null
export const exceptionPath = (ruleContextPath: string[], ruleContext: any): ?string[] => {
  if (ruleContext == null || ruleContext.exception != null) return [];
  const Accumulator = Record({ exception: false, path: new List(), ruleContext });

  const result = R.reduce(scanForException, new Accumulator(), ruleContextPath);
  return result.exception ? result.path.toArray() : null;
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
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choiceType) return exceptionPath(['CHOICE_TYPE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonDecimal) return exceptionPath(['COMMON_DECIMAL'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonInteger) return exceptionPath(['COMMON_INTEGER'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonShort) return exceptionPath(['COMMON_SHORT'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonString) return exceptionPath(['COMMON_STRING'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonType) return exceptionPath(['COMMON_TYPE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonTypeExtension) return exceptionPath(['COMMON_TYPE'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return exceptionPath(['DESCRIPTOR_ENTITY'], ruleContext);
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
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return exceptionPath(['ENUMERATION_ENTITY'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommonType) return exceptionPath(['INLINE_COMMON_TYPE'], ruleContext);
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
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_choiceType) return exceptionPath(['choiceName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonDecimal) return exceptionPath(['commonDecimalName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonInteger) return exceptionPath(['commonIntegerName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonShort) return exceptionPath(['commonShortName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonString) return exceptionPath(['commonStringName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonType) return exceptionPath(['commonName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_commonTypeExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_descriptor) return exceptionPath(['descriptorName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domain) return exceptionPath(['domainName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) return exceptionPath(['entityName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) return exceptionPath(['entityName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumeration) return exceptionPath(['enumerationName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_inlineCommonType) return exceptionPath(['inlineCommonName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange) return exceptionPath(['interchangeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension) return exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_subdomain) return exceptionPath(['subdomainName', 'ID'], ruleContext);
  throw new Error(`ValidationHelper.entityNameExceptionPath encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}

export function itemNameExceptionPath(ruleContext: any): ?string[] {
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_domainItem) return exceptionPath(['ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_enumerationItem) return exceptionPath(['shortDescription'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeElement) return exceptionPath(['ID'], ruleContext);
  if (ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeIdentityTemplate) return exceptionPath(['ID'], ruleContext);
  throw new Error(`RuleInformation.itemName encountered unknown context with rule index ${ruleContext.ruleIndex}.`);
}
