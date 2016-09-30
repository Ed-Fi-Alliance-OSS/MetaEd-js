// @flow
import ValidationLevel from './ValidationLevel';
import SymbolTable from './SymbolTable';

export default function validationRuleBase(errorLevel: ValidationLevel,
                                           handled: (ruleContext: any) => boolean,
                                           valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
                                           failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
                                           ruleContext: any,
                                           symbolTable: SymbolTable) : ValidationResult  {
  const result : ValidationResult = {
    handled: handled(ruleContext)
  };

  if (!result.handled) return result;
  result.errorLevel = errorLevel;
  result.valid = valid(ruleContext, symbolTable);

  if (result.valid) return result;

  result.failureMessage = failureMessage(ruleContext, symbolTable);
  return result;
}

export type ValidationRule = (ruleContext: any, symbolTable: SymbolTable) => ValidationResult;

export type ValidationResult = {
    handled: boolean,
    errorLevel?: ValidationLevel,
    valid?: boolean,
    failureMessage?: string
};

export function getProperty(propertyContext: any) : any {
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
    return null;
}