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
