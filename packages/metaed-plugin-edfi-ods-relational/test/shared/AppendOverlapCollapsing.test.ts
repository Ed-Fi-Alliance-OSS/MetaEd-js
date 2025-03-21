// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { appendOverlapCollapsing } from '../../src/shared/Utility';

describe('when appending overlapping strings', (): void => {
  it('should append normally if no overlap :: AaaBbb, CccDdd => AaaBbbCccDdd', () =>
    expect(appendOverlapCollapsing('AaaBbb', 'CccDdd')).toBe('AaaBbbCccDdd'));
  it('should fully collapse if a prefix :: AaaBbb, AaaBbbCcc => AaaBbbCcc', () =>
    expect(appendOverlapCollapsing('AaaBbb', 'AaaBbbCcc')).toBe('AaaBbbCcc'));
  it('should fully collapse if a suffix :: AaaBbbCcc, BbbCcc => AaaBbbCcc', () =>
    expect(appendOverlapCollapsing('AaaBbbCcc', 'BbbCcc')).toBe('AaaBbbCcc'));
  it('should collapse single word overlap :: AaaBbbCcc, CccDddEee => AaaBbbCccDddEee', () =>
    expect(appendOverlapCollapsing('AaaBbbCcc', 'CccDddEee')).toBe('AaaBbbCccDddEee'));
  it('should collapse two word overlap :: AaaBbbCcc, BbbCccDdd => AaaBbbCccDdd', () =>
    expect(appendOverlapCollapsing('AaaBbbCcc', 'BbbCccDdd')).toBe('AaaBbbCccDdd'));
  it('should collapse three word overlap :: AaaBbbCccDdd, BbbCccDddEee => AaaBbbCccDddEee', () =>
    expect(appendOverlapCollapsing('AaaBbbCccDdd', 'BbbCccDddEee')).toBe('AaaBbbCccDddEee'));
  it('should collapse with left side longer :: AaaBbbCccDddEee, DddEeeFff => AaaBbbCccDddEeeFff', () =>
    expect(appendOverlapCollapsing('AaaBbbCccDddEee', 'DddEeeFff')).toBe('AaaBbbCccDddEeeFff'));
  it('should collapse with right side longer :: AaaBbbCcc, BbbCccDddEeeFff => AaaBbbCccDddEeeFff', () =>
    expect(appendOverlapCollapsing('AaaBbbCcc', 'BbbCccDddEeeFff')).toBe('AaaBbbCccDddEeeFff'));
  it('should not remove words not in overlap :: AaaBbbCccDdd, CccDddEeeAaa => AaaBbbCccDddEeeAaa', () =>
    expect(appendOverlapCollapsing('AaaBbbCccDdd', 'CccDddEeeAaa')).toBe('AaaBbbCccDddEeeAaa'));
});
