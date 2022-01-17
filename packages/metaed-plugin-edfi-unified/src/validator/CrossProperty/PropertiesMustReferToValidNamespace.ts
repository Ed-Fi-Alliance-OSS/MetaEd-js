import { MetaEdEnvironment, PropertyIndex, ValidationFailure, EntityProperty } from '@edfi/metaed-core';

function propertiesNeedingChecking(properties: PropertyIndex): EntityProperty[] {
  const result: EntityProperty[] = [];

  result.push(...properties.association);
  result.push(...properties.choice);
  result.push(...properties.common);
  result.push(...properties.descriptor);
  result.push(...properties.domainEntity);
  result.push(...properties.enumeration);
  result.push(...properties.inlineCommon);
  result.push(...properties.sharedDecimal);
  result.push(...properties.sharedInteger);
  result.push(...properties.sharedShort);
  result.push(...properties.sharedString);
  return result;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  propertiesNeedingChecking(metaEd.propertyIndex).forEach((property) => {
    if (property.referencedNamespaceName && !metaEd.namespace.has(property.referencedNamespaceName)) {
      failures.push({
        validatorName: 'PropertiesMustReferToValidNamespace',
        category: 'error',
        message: `${property.referencedNamespaceName} is a not a valid project namespace.`,
        sourceMap: property.sourceMap.referencedNamespaceName,
        fileMap: null,
      });
    }
  });

  return failures;
}
