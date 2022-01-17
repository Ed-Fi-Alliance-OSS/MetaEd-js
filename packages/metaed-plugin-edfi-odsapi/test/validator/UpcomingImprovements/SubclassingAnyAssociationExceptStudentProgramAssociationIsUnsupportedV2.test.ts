import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/SubclassingAnyAssociationExceptStudentProgramAssociationIsUnsupportedV2';

describe('when an association subclass subclasses StudentProgramAssociation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseEntityName = 'StudentProgramAssociation';
  const subclassName = 'SubclassName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(baseEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartAssociationSubclass(subclassName, baseEntityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get('Extension');
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    const entity = coreNamespace.entity.association.get(baseEntityName);
    const subclass = extensionNamespace.entity.associationSubclass.get(subclassName);

    metaEd.dataStandardVersion = '2.0.0';

    if (entity && subclass) subclass.baseEntity = entity;
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when an association subclass subclasses a non-StudentProgramAssociation association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseEntityName = 'NotStudentProgramAssociation';
  const subclassName = 'SubclassName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(baseEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartAssociationSubclass(subclassName, baseEntityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get('Extension');
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    const entity = coreNamespace.entity.association.get(baseEntityName);
    const subclass = extensionNamespace.entity.associationSubclass.get(subclassName);

    metaEd.dataStandardVersion = '2.0.0';

    if (entity && subclass) subclass.baseEntity = entity;

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubclassingAnyAssociationExceptStudentProgramAssociationIsUnsupportedV2');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when a association subclass subclasses a non-StudentProgramAssociation association should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a association subclass subclasses a non-StudentProgramAssociation association should have validation failure -> sourceMap',
    );
  });
});
