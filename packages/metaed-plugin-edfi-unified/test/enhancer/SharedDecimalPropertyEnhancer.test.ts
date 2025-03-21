// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import { addProperty, newMetaEdEnvironment, newSharedDecimal, newSharedDecimalProperty } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/SharedDecimalPropertyEnhancer';

describe('when shared decimal property refers to a shared decimal', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName = 'ReferencedEntityName';

  const totalDigits = '5';
  const decimalPlaces = '4';
  const maxValue = '100';
  const minValue = '1';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName,
      totalDigits,
      decimalPlaces,
      maxValue,
      minValue,
    });

    const property = Object.assign(newSharedDecimalProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the shared decimal restrictions', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((p) => p.metaEdName === metaEdName));
    expect(property.totalDigits).toBe(totalDigits);
    expect(property.decimalPlaces).toBe(decimalPlaces);
    expect(property.maxValue).toBe(maxValue);
    expect(property.minValue).toBe(minValue);
  });
});

describe('when shared decimal property refers to a shared decimal with empty min/max values', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const metaEdName = 'ReferencedEntityName';

  const totalDigits = '5';
  const decimalPlaces = '4';
  const maxValue = '';
  const minValue = '';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedDecimal(), {
      metaEdName,
      totalDigits,
      decimalPlaces,
      maxValue,
      minValue,
    });

    const property = Object.assign(newSharedDecimalProperty(), {
      metaEdName,
      referencedEntity,
    });
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have the empty shared decimal restrictions as null', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((p) => p.metaEdName === metaEdName));
    expect(property.totalDigits).toBe(totalDigits);
    expect(property.decimalPlaces).toBe(decimalPlaces);
    expect(property.maxValue).toBeNull();
    expect(property.minValue).toBeNull();
  });
});
