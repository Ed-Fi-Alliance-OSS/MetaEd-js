// @flow
import type SymbolTable, { EntityContext } from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';

// eslint-disable-next-line import/prefer-default-export
export function lookupParentEntityContext(symbolTable: SymbolTable, parentRuleContext: any): ?EntityContext {
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

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_choice) {
    return symbolTable.get(SymbolTableEntityType.choice(), parentRuleContext.choiceName().ID().getText());
  }

  throw new Error(`TargetPropertyPathMustExist.lookupParentEntityContext: parentRuleContext was unexpected type ${parentRuleContext.ruleIndex}`);
}

export function propertyPathParts(propertyPathContext: any): string[] {
  return propertyPathContext.propertyPath().ID().map(x => x.getText());
}
