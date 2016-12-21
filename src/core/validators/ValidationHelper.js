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
  return !commonSimpleTypeExists(propertyRuleContext.propertyName().getText(), symbolTable);
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

  if (acc.get('ruleContext')[pathElement] == null) {
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
  if (ruleContext.exception != null) return [];
  const Accumulator = Record({ exception: false, path: new List(), ruleContext });
  const result = R.reduce(scanForException, new Accumulator(), ruleContextPath);
  return result.exception ? result.path.toArray() : null;
};
