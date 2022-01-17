import { newMetaEdEnvironment, MetaEdTextBuilder, AssociationExtensionBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AssociationExtension/AssociationExtensionMustNotBeInSameNamespaceAsBase';

describe('when association extension is in correct namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationExtension(`EdFi.${entityName}`)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));
    extensionNamespace = metaEd.namespace.get('Extension');
    failures = validate(metaEd);
  });

  it('should build one association extension', (): void => {
    expect(extensionNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association extension is in core namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association extension', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationExtensionMustNotBeInSameNamespaceAsBase');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
