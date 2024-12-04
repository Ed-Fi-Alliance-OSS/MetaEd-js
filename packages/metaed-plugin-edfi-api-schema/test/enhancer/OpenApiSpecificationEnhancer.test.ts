import { MetaEdEnvironment, MetaEdTextBuilder, NamespaceBuilder, newMetaEdEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/OpenApiSpecificationEnhancer';

describe('when building open api specification', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build().withBeginNamespace(namespaceName).sendToListener(new NamespaceBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    enhance(metaEd);
  });

  it('should be correct OpenApiSpecification', () => {
    const openApiSpec = namespace.data.openApiSpecification;
    expect(openApiSpec).toMatchInlineSnapshot(`
      Object {
        "info": Object {
          "description": "Ed-Fi Alliance Data Management Service",
          "title": "Ed-Fi Alliance Data Management Service",
          "version": "0",
        },
        "openapi": "3.0.1",
        "servers": Array [
          Object {
            "url": "http://localhost:5198/",
          },
        ],
      }
    `);
  });
});
