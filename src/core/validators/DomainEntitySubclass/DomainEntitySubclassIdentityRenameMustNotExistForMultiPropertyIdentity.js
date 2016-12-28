// @flow
import { exceptionPath, validPath, getProperty } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity';
  let invalidPath: ?string[] = exceptionPath(['baseName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['entityName'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const property of ruleContext.property()) {
    const concreteProperty = getProperty(property);
    invalidPath = exceptionPath(['propertyComponents', 'propertyAnnotation', 'identityRename'], concreteProperty);
    if (invalidPath) return { invalidPath, validatorName };
  }

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (!ruleContext.property().some(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null)) return true;

  const baseEntityContext = symbolTable.get(SymbolTableEntityType.domainEntity(), ruleContext.baseName().getText());
  if (baseEntityContext == null) return true;

  return Array.from(baseEntityContext.propertySymbolTable.values())
      .filter(x => validPath(['propertyComponents', 'propertyAnnotation', 'identity'], x)).length <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const baseIdentifier = ruleContext.baseName().getText();
  return `Domain Entity '${ruleContext.entityName().getText()}' based on '${baseIdentifier}' is invalid for identity rename because parent entity '${baseIdentifier}' has more than one identity property.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntitySubclass, validationRule);
