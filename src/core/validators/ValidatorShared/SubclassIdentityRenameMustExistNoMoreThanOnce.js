// @flow
import R from 'ramda';
import { exceptionPath, getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import type { ValidatableResult } from '../ValidationTypes';

export const validatable = R.curry(
  (validatorName: string, ruleContext: any): ValidatableResult => {
    let invalidPath: ?string[] = exceptionPath(['baseName'], ruleContext);

    if (invalidPath) return { invalidPath, validatorName };

    // eslint-disable-next-line no-restricted-syntax
    for (const property of ruleContext.property()) {
      const concreteProperty = getProperty(property);
      invalidPath = exceptionPath(['propertyComponents', 'propertyAnnotation', 'identityRename'], concreteProperty);
      if (invalidPath) return { invalidPath, validatorName };

      const identityRenames = ruleContext.property().map(p => getProperty(p).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);

      // eslint-disable-next-line no-restricted-syntax
      for (const identityRename of identityRenames) {
        invalidPath = exceptionPath(['baseKeyName'], identityRename);
        if (invalidPath) return { invalidPath, validatorName };
      }
    }

    return { validatorName };
  });

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.property().filter(p => getProperty(p).propertyComponents().propertyAnnotation().identityRename() != null).length <= 1;
}

/* eslint-disable no-unused-vars */
export const failureMessage = R.curry(
  (entityTitle: string, identifierFinder: (ruleContext: any) => string, ruleContext: any, symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const identityRenames = ruleContext.property().map(p => getProperty(p).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);
    const basePropertyIdentifier = identityRenames.map(ir => ir.baseKeyName().getText()).join(', ');
    return `${entityTitle} '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given ${entityTitle}.`;
  });
