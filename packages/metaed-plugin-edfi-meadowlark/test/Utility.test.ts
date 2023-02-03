// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { pluralize } from '../src/Utility';

describe('when pluralizing a word', () => {
  // Testing the offender (accommodation) plus some random other words
  it.each([
    ['accommodation', 'accommodations'],
    ['property', 'properties'],
    ['item', 'items'],
    ['descriptor', 'descriptors'],
    ['mouse', 'mice'],
  ])('Pluralizes %s as %s', (input: string, output: string) => {
    expect(pluralize(input)).toBe(output);
  });
});
