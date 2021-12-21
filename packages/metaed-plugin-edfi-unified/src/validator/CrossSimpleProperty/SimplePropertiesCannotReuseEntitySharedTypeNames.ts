import {
  EntityProperty,
  SimpleProperty,
  MetaEdEnvironment,
  PropertyIndex,
  SharedSimple,
  ValidationFailure,
  Namespace,
} from 'metaed-core';

function sharedSimpleNeedingDuplicateChecking(namespace: Namespace): SharedSimple[] {
  const result: SharedSimple[] = [];
  result.push(...namespace.entity.sharedString.values());
  result.push(...namespace.entity.sharedDecimal.values());
  result.push(...namespace.entity.sharedInteger.values());
  return result;
}

function propertiesNeedingDuplicateChecking(properties: PropertyIndex, namespace: Namespace): Map<string, SimpleProperty> {
  const result: SimpleProperty[] = [];

  result.push(...properties.string.filter((property: EntityProperty) => namespace === property.namespace));
  result.push(...properties.decimal.filter((property: EntityProperty) => namespace === property.namespace));
  result.push(...properties.integer.filter((property: EntityProperty) => namespace === property.namespace));
  result.push(...properties.short.filter((property: EntityProperty) => namespace === property.namespace));

  // @ts-ignore -- typescript not correctly typing map() operation as SimpleProperty => [string, SimpleProperty] tuples
  return new Map(result.map((i) => [i.metaEdName, i]));
}

function generateValidationErrorsForDuplicates(
  metaEdProperty: Map<string, SimpleProperty>,
  metaedEntities: SharedSimple[],
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaedEntities.forEach((entity: SharedSimple) => {
    const isDuplicate: boolean = metaEdProperty.has(entity.metaEdName);
    if (isDuplicate) {
      const property: SimpleProperty = metaEdProperty.get(entity.metaEdName) as SimpleProperty;
      failures.push(
        {
          validatorName: 'SimplePropertiesCannotReuseEntitySharedTypeNames',
          category: 'error',
          message: `${entity.typeHumanizedName} named ${entity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        },
        {
          validatorName: 'SimplePropertiesCannotReuseEntitySharedTypeNames',
          category: 'error',
          message: `${property.typeHumanizedName} named ${property.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: property.sourceMap.metaEdName,
          fileMap: null,
        },
      );
    }
  });
  return failures;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    failures.push(
      ...generateValidationErrorsForDuplicates(
        propertiesNeedingDuplicateChecking(metaEd.propertyIndex, namespace),
        sharedSimpleNeedingDuplicateChecking(namespace),
      ),
    );
  });

  return failures;
}
