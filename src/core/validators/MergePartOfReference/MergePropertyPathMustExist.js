// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { entityIdentifier, entityName } from '../RuleInformation';
import { namespaceAncestorContext, topLevelEntityAncestorContext, propertyAncestorContext,
  isExtensionNamespace, namespaceNameFor } from '../ValidationHelper';



// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const propertyPathParts = ruleContext.propertyPath().ID().map(x => x.getText());

  return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());

}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Path ${ruleContext.getText()} is not valid.`;
}




//TODO This is wrong -- it is from target property path must exist, similar but with tweaks


function lookupParentEntityContext(symbolTable: SymbolTable, ruleContext: any): ?EntityContext {
  // first parent - mergePartOfReference
  // second parent - referenceProperty
  // third parent - property collection
  // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
  const parentRuleContext = ruleContext.parentCtx.parentCtx.parentCtx.parentCtx;

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) {
    return symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.entityName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.extendeeName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
    // since the property has to be a PK, it must be defined on the base
    const domainEntity = symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.baseName().ID().getText());
    if (domainEntity != null) return domainEntity;
    return symbolTable.get(SymbolTableEntityType.abstractEntity(), parentRuleContext.baseName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_association) {
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.associationName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.extendeeName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.baseName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) {
    return symbolTable.get(SymbolTableEntityType.abstractEntity(), parentRuleContext.abstractEntityName().ID().getText());
  }

  throw new Error('TargetPropertyPathMustExist.lookupParentEntityContext: parentRuleContext was unexpected type');
}











const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePropertyPath, validationRule);