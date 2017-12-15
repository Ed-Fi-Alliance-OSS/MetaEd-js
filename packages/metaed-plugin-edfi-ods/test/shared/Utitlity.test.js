// @flow
import { appendOverlapping } from '../../src/shared/Utility';

describe('when appending overlapping strings', () => {
  it('should append normally if no overlap :: AaaBbb, CccDdd => AaaBbbCccDdd', () =>
    expect(appendOverlapping('AaaBbb', 'CccDdd')).toBe('AaaBbbCccDdd'),
  );
  it('should fully collapse if a prefix :: AaaBbb, AaaBbbCcc => AaaBbbCcc', () =>
    expect(appendOverlapping('AaaBbb', 'AaaBbbCcc')).toBe('AaaBbbCcc'),
  );
  it('should fully collapse if a suffix :: AaaBbbCcc, BbbCcc => AaaBbbCcc', () =>
    expect(appendOverlapping('AaaBbbCcc', 'BbbCcc')).toBe('AaaBbbCcc'),
  );
  it('should collapse single word overlap :: AaaBbbCcc, CccDddEee => AaaBbbCccDddEee', () =>
    expect(appendOverlapping('AaaBbbCcc', 'CccDddEee')).toBe('AaaBbbCccDddEee'),
  );
  it('should collapse two word overlap :: AaaBbbCcc, BbbCccDdd => AaaBbbCccDdd', () =>
    expect(appendOverlapping('AaaBbbCcc', 'BbbCccDdd')).toBe('AaaBbbCccDdd'),
  );
  it('should collapse three word overlap :: AaaBbbCccDdd, BbbCccDddEee => AaaBbbCccDddEee', () =>
    expect(appendOverlapping('AaaBbbCccDdd', 'BbbCccDddEee')).toBe('AaaBbbCccDddEee'),
  );
  it('should collapse with left side longer :: AaaBbbCccDddEee, DddEeeFff => AaaBbbCccDddEeeFff', () =>
    expect(appendOverlapping('AaaBbbCccDddEee', 'DddEeeFff')).toBe('AaaBbbCccDddEeeFff'),
  );
  it('should collapse with right side longer :: AaaBbbCcc, BbbCccDddEeeFff => AaaBbbCccDddEeeFff', () =>
    expect(appendOverlapping('AaaBbbCcc', 'BbbCccDddEeeFff')).toBe('AaaBbbCccDddEeeFff'),
  );
  it('should not remove words not in overlap :: AaaBbbCccDdd, CccDddEeeAaa => AaaBbbCccDddEeeAaa', () =>
    expect(appendOverlapping('AaaBbbCccDdd', 'CccDddEeeAaa')).toBe('AaaBbbCccDddEeeAaa'),
  );
});
