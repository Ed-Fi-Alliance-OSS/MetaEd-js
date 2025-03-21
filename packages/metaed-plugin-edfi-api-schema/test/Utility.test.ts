// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { pluralize, uncapitalize } from '../src/Utility';

describe('when pluralizing a word', () => {
  // Testing the offender (accommodation) plus some random other words
  it.each([
    ['accommodation', 'accommodations'],
    ['Accommodation', 'Accommodations'],
    ['property', 'properties'],
    ['item', 'items'],
    ['descriptor', 'descriptors'],
    ['mouse', 'mice'],
  ])('Pluralizes %s as %s', (input: string, output: string) => {
    expect(pluralize(input)).toBe(output);
  });
});

describe('when uncapitalizg a word', () => {
  it.each([
    ['urls', 'urls'],
    ['Urls', 'urls'],
    ['URLS', 'urls'],
    ['URLs', 'urls'],
    ['URLAtFirst', 'urlAtFirst'],
    ['AtTheEndIsURL', 'atTheEndIsURL'],
    ['InTheMiddleURLIsFound', 'inTheMiddleURLIsFound'],
  ])('Uncapitalizes %s as %s', (input: string, output: string) => {
    expect(uncapitalize(input)).toBe(output);
  });
});
