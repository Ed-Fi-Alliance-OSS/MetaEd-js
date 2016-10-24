// @flow

export function parentIdentifierForPropertyContext(propertyContext: any): string {
  const propertyComponentsContext = propertyContext.parentCtx;
  if (propertyComponentsContext == null) return '';

  const parentEntityContext = propertyComponentsContext.parentCtx;
  if (parentEntityContext == null) return '';

  const parentEntityNameContext = parentEntityContext.getChild(1);
  return parentEntityNameContext == null ? '' : parentEntityNameContext.getText();
}

export function parentTypeNameForPropertyContext(propertyContext: any): string {
  const propertyComponentsContext = propertyContext.parentCtx;
  if (propertyComponentsContext == null) return '';

  const parentEntityContext = propertyComponentsContext.parentCtx;
  if (parentEntityContext == null) return '';

  // TODO: this implementation returns base type even for extension/subclass
  const parentTypeNameContext = parentEntityContext.getChild(0);
  return parentTypeNameContext == null ? '' : parentTypeNameContext.getText();
}
