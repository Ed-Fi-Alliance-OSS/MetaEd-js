// @flow
import R from 'ramda';
import { exceptionPath, getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';
import type { ValidatableResult } from '../ValidationTypes';

function getIdentityRenames(ruleContext: any): Array<any> {
  return ruleContext.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null)
  .map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename());
}

function getBasePropertyIdentifierFor(identityRenames: Array<any>): any {
  return R.head(identityRenames).baseKeyName().getText();
}

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

export const valid = R.curry(
  (baseKey: string, ruleContext: any, symbolTable: SymbolTable): boolean => {
    const identityRenames = getIdentityRenames(ruleContext);
    if (identityRenames.length === 0) return true;

    const baseIdentifier = ruleContext.baseName().getText();
    const baseSymbolTable = symbolTable.get(baseKey, baseIdentifier);
    if (baseSymbolTable == null) return true;

    const baseProperty = baseSymbolTable.propertySymbolTable.get(getBasePropertyIdentifierFor(identityRenames));
    if (baseProperty == null) return false;

    return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
  });

/* eslint-disable no-unused-vars */
export const failureMessage = R.curry(
  (entityTitle: string, identifierFinder: (ruleContext: any) => string, ruleContext: any, symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const basePropertyIdentifier = getBasePropertyIdentifierFor(getIdentityRenames(ruleContext));
    return `${entityTitle} '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
  });
