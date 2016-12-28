// @flow
import { exceptionPath } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity';
  let invalidPath: ?string[] = exceptionPath(['baseName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['entityName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const basedOnName = ruleContext.baseName().getText();
  return Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.domainEntity())).some(x => x === basedOnName) ||
    Array.from(symbolTable.identifiersForEntityType(SymbolTableEntityType.abstractEntity())).some(x => x === basedOnName);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity '${ruleContext.entityName().getText()}' based on '${ruleContext.baseName().getText()}' does not match any declared domain or abstract entity.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntitySubclass, validationRule);
