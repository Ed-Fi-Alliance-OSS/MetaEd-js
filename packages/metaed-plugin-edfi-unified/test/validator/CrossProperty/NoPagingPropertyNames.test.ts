import { newMetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder, DomainEntityBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CrossProperty/NoPagingPropertyNames';

describe('when using reserved paging keywords as property names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withProperty('string', 'Property', 'doc', true, false)
      .withProperty('integer', 'Offsets', 'doc', true, false)
      .withProperty('integer', 'Offset', 'doc', true, false)
      .withProperty('integer', 'Limit', 'doc', true, false)
      .withProperty('integer', 'TotalCount', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(3);
    expect(failures[0].validatorName).toBe('NoPagingPropertyNames');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Offset is reserved for paging queries. Reserved keywords are Offset, Limit and TotalCount"`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 12,
        "line": 13,
        "tokenText": "Offset",
      }
    `);

    expect(failures[1].validatorName).toBe('NoPagingPropertyNames');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Limit is reserved for paging queries. Reserved keywords are Offset, Limit and TotalCount"`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 12,
        "line": 17,
        "tokenText": "Limit",
      }
    `);

    expect(failures[2].validatorName).toBe('NoPagingPropertyNames');
    expect(failures[2].category).toBe('error');
    expect(failures[2].message).toMatchInlineSnapshot(
      `"TotalCount is reserved for paging queries. Reserved keywords are Offset, Limit and TotalCount"`,
    );
    expect(failures[2].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 12,
        "line": 21,
        "tokenText": "TotalCount",
      }
    `);
  });
});
