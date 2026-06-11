// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type EntityProperty, type IntegerProperty, type StringProperty } from '@edfi/metaed-core';
import type { SchemaObject } from '../model/OpenApiTypes';

/**
 * Returns an OpenAPI schema object corresponding to the given scalar property based on its semantic type.
 */
export function schemaObjectFromEntityProperty(
  property: EntityProperty,
  unsupportedPropertySchema: SchemaObject = { type: 'boolean' },
): SchemaObject {
  switch (property.type) {
    case 'boolean':
      return { type: 'boolean' };

    case 'duration':
      return { type: 'string', maxLength: 30 };

    case 'currency':
    case 'decimal':
    case 'percent':
    case 'sharedDecimal':
      return { type: 'number', format: 'double' };

    case 'date':
      return { type: 'string', format: 'date' };

    case 'datetime':
      return { type: 'string', format: 'date-time' };

    case 'descriptor':
    case 'enumeration':
      return { type: 'string', maxLength: 306 };

    case 'integer':
    case 'sharedInteger': {
      const integerProperty: IntegerProperty = property as IntegerProperty;
      return { type: 'integer', format: integerProperty.hasBigHint ? 'int64' : 'int32' };
    }

    case 'short':
    case 'sharedShort':
    case 'schoolYearEnumeration':
    case 'year':
      return { type: 'integer', format: 'int32' };

    case 'string':
    case 'sharedString': {
      const result: SchemaObject = { type: 'string' };
      const stringProperty: StringProperty = property as StringProperty;
      if (stringProperty.minLength) result.minLength = Number(stringProperty.minLength);
      if (stringProperty.maxLength) result.maxLength = Number(stringProperty.maxLength);
      return result;
    }

    case 'time':
      return { type: 'string' };

    default:
      return unsupportedPropertySchema;
  }
}
