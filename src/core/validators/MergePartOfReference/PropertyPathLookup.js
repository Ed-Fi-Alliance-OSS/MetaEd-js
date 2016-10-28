// @flow
import R from 'ramda';
import type SymbolTable, { EntityContext } from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';

export function matchAllIdentityProperties(): (propertyRuleContext: any) => boolean {
  return propertyWithComponents => propertyWithComponents.propertyComponents().propertyAnnotation().identity() != null ||
  propertyWithComponents.propertyComponents().propertyAnnotation().identityRename() != null;
}

export function matchAllButFirstAsIdentityProperties(): (propertyRuleContext: any) => boolean {
  let first: boolean = true;
  let firstComponent: any = null;

  return (components: any): boolean => {
    if (first) {
      first = false;
      firstComponent = components;
      return true;
    }

    if (firstComponent != null && firstComponent === components) return true;
    return components.propertyComponents().propertyAnnotation().identity() != null;
  };
}

function findAssociationDomainEntityProperty(entityContext: EntityContext, propertyNameToMatch: string): any {
  if (entityContext.context.ruleIndex !== MetaEdGrammar.RULE_association) return null;

  if (entityContext.context.firstDomainEntity().propertyName().ID.getText() === propertyNameToMatch) {
    return entityContext.context.firstDomainEntity();
  }

  if (entityContext.context.secondDomainEntity().propertyName().ID.getText() === propertyNameToMatch) {
    return entityContext.context.secondDomainEntity();
  }

  return null;
}

function getEntityType(symbolTable: SymbolTable, identifierToMatch: string): ?string {
  if (symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch)) return SymbolTableEntityType.domainEntity();
  if (symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch)) return SymbolTableEntityType.association();
  if (symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch)) return SymbolTableEntityType.abstractEntity();

  // since this is only being used to find properties that are part of the identity
  // we won't look for extensions and subclasses now
  return null;
}

export function findReferencedProperty(symbolTable: SymbolTable, startingEntityContext: EntityContext, propertyPath: string[], filter: (propertyRuleContext: any) => boolean): any {
  let entityContext: ?EntityContext = startingEntityContext;
  let entityName: ?string = null;
  let propertyContext: any = null;

  // because of the way the original C# code jumps out of the loop, must use for..of until rewrite
  // eslint-disable-next-line no-restricted-syntax
  for (const propertyPathPart of propertyPath) {
    if (entityContext == null) {
      if (entityName == null) throw new Error('PropertyPathLookup.findReferencedProperty: entityName unexpectedly null');
      const entityType = getEntityType(symbolTable, entityName);
      if (entityType == null) return null;
      entityContext = symbolTable.get(entityType, entityName);
    }

    if (entityContext == null) throw new Error('PropertyPathLookup.findReferencedProperty: entityContext unexpectedly null');
    const matchingProperties = entityContext.propertySymbolTable.getWithoutContext(propertyPathPart).filter(filter);
    if (!R.isEmpty(matchingProperties)) {
      propertyContext = findAssociationDomainEntityProperty(entityContext, propertyPathPart);
      if (propertyContext == null) return null;
    } else if (matchingProperties.length > 1) {
      return null;
    } else {
      propertyContext = R.head(matchingProperties);
    }

    if (propertyContext.ruleIndex === MetaEdGrammar.RULE_referenceProperty ||
      propertyContext.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity ||
      propertyContext.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity) {
      entityName = propertyContext.propertyName().ID().getText();
    } else entityName = null;

    entityContext = null;
  }

  return propertyContext;
}

export function validate(symbolTable: SymbolTable, startingEntityContext: EntityContext, propertyPath: string[], filter: (propertyRuleContext: any) => boolean): boolean {
  return findReferencedProperty(symbolTable, startingEntityContext, propertyPath, filter) != null;
}
