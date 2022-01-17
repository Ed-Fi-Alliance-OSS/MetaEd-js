import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/SubclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported';

describe('when an association subclass subclasses GeneralStudentProgramAssociation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseEntityName = 'GeneralStudentProgramAssociation';
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

    metaEd.dataStandardVersion = '3.0.0';

    if (entity && subclass) subclass.baseEntity = entity;
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when an association subclass subclasses a non-GeneralStudentProgramAssociation association', (): void => {
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

    metaEd.dataStandardVersion = '3.0.0';

    if (entity && subclass) subclass.baseEntity = entity;

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when a association subclass subclasses a non-GeneralStudentProgramAssociation association should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a association subclass subclasses a non-GeneralStudentProgramAssociation association should have validation failure -> sourceMap',
    );
  });
});

describe('when an association subclass subclasses StudentProgramAssociation association', (): void => {
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

    metaEd.dataStandardVersion = '3.0.0';

    if (entity && subclass) subclass.baseEntity = entity;

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when an association subclass subclasses StudentProgramAssociation association should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when an association subclass subclasses StudentProgramAssociation association should have validation failure -> sourceMap',
    );
  });
});
