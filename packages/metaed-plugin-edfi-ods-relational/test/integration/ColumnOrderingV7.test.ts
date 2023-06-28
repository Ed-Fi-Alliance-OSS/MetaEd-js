import {
  Association,
  AssociationBuilder,
  DescriptorBuilder,
  DomainEntity,
  DomainEntityBuilder,
  Enhancer,
  EnumerationBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  Namespace,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { metaEdPluginEnhancers } from './PluginHelper';

jest.setTimeout(40000);

describe('when StudentSchoolAssociation has a GraduationPlan and targeting ODS/API 7.0', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '5.0.0-pre.1' };
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion: '7.0.0' });

  const studentSchoolAssociationName = 'StudentSchoolAssociation';
  const graduationPlanName = 'GraduationPlan';
  let namespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(studentSchoolAssociationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Student', 'doc')
      .withAssociationDomainEntityProperty('School', 'doc')
      .withDateIdentity('EntryDate', 'doc')
      .withDomainEntityProperty(graduationPlanName, 'doc', false, true, false, 'Alternative')
      .withEndAssociation()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '100')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(graduationPlanName)
      .withDocumentation('doc')
      .withDescriptorIdentity('GraduationPlanType', 'doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('GraduationPlanType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEndEnumeration()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi') as Namespace;
    metaEdPluginEnhancers().forEach((enhancer: Enhancer) => {
      enhancer(metaEd);
    });
  });

  it('should have two tables for association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(
      studentSchoolAssociationName,
    ) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables).toHaveLength(2);
  });

  it('should have correct column order for main table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(
      studentSchoolAssociationName,
    ) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[0].columns.map((x) => x.columnId))
      .toMatchInlineSnapshot(`
      Array [
        "EntryDate",
        "SchoolId",
        "StudentUniqueId",
      ]
    `);
  });

  it('should have correct foreign key order for main table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(
      studentSchoolAssociationName,
    ) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[0].foreignKeys.map((x) => x.columnPairs))
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "StudentUniqueId",
            "parentTableColumnId": "StudentUniqueId",
          },
        ],
      ]
    `);
  });

  it('should have correct column order for sub table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(
      studentSchoolAssociationName,
    ) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[1].columns.map((x) => x.columnId))
      .toMatchInlineSnapshot(`
      Array [
        "EntryDate",
        "SchoolId",
        "StudentUniqueId",
        "AlternativeEducationOrganizationId",
        "AlternativeGraduationPlanTypeDescriptorId",
        "AlternativeSchoolYear",
      ]
    `);
  });

  it('should have correct foreign key order for sub table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(
      studentSchoolAssociationName,
    ) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[1].foreignKeys.map((x) => x.columnPairs))
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "EntryDate",
            "parentTableColumnId": "EntryDate",
          },
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
          Object {
            "foreignTableColumnId": "StudentUniqueId",
            "parentTableColumnId": "StudentUniqueId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "EducationOrganizationId",
            "parentTableColumnId": "AlternativeEducationOrganizationId",
          },
          Object {
            "foreignTableColumnId": "GraduationPlanTypeDescriptorId",
            "parentTableColumnId": "AlternativeGraduationPlanTypeDescriptorId",
          },
          Object {
            "foreignTableColumnId": "SchoolYear",
            "parentTableColumnId": "AlternativeSchoolYear",
          },
        ],
      ]
    `);
  });

  it('should have one table for GraduationPlan', (): void => {
    const graduationPlan: DomainEntity = namespace.entity.domainEntity.get(graduationPlanName) as DomainEntity;
    expect(graduationPlan.data.edfiOdsRelational.odsTables).toHaveLength(1);
  });

  it('should have correct column order for main table of GraduationPlan', (): void => {
    const graduationPlan: DomainEntity = namespace.entity.domainEntity.get(graduationPlanName) as DomainEntity;
    expect(graduationPlan.data.edfiOdsRelational.odsTables[0].columns.map((x) => x.columnId)).toMatchInlineSnapshot(`
      Array [
        "EducationOrganizationId",
        "GraduationPlanTypeDescriptorId",
        "SchoolYear",
      ]
    `);
  });
});

// describe('when building a simple core and two simple extension projects', (): void => {
//   let state: State;

//   beforeAll(async () => {
//     state = {
//       ...newState(),
//       metaEdConfiguration,
//       metaEdPlugins: metaEdPlugins(),
//     };

//     state.metaEd.dataStandardVersion = '3.0.0';

//     setupPlugins(state);
//     loadFiles(state);
//     loadFileIndex(state);
//     buildParseTree(buildMetaEd, state);
//     await walkBuilders(state);
//     initializeNamespaces(state);
//     // eslint-disable-next-line no-restricted-syntax
//     for (const metaEdPlugin of state.metaEdPlugins) {
//       runValidators(metaEdPlugin, state);
//       await runEnhancers(metaEdPlugin, state);
//     }
//   });

//   it('should have no validation errors', (): void => {
//     expect(state.validationFailure.length).toBe(0);
//   });

//   it('should have core domain entity', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
//     if (namespace == null) throw new Error();
//     expect(namespace.entity.domainEntity.get('EdfiDomainEntity')).toBeDefined();
//   });

//   it('should have gb domain entity', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
//     if (namespace == null) throw new Error();
//     expect(namespace.entity.domainEntity.get('GbDomainEntity')).toBeDefined();
//   });

//   it('should have sample domain entity', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
//     if (namespace == null) throw new Error();
//     expect(namespace.entity.domainEntity.get('SampleDomainEntity')).toBeDefined();
//   });

//   it('should have core ods table', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
//     if (namespace == null) throw new Error();
//     const edfiDomainEntity = namespace.entity.domainEntity.get('EdfiDomainEntity');
//     if (edfiDomainEntity == null) throw new Error();
//     expect(edfiDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('EdfiPrimaryIdentity');
//     expect(edfiDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('edfi');
//   });

//   it('should have gb ods table with reference to core', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
//     if (namespace == null) throw new Error();
//     const gbDomainEntity = namespace.entity.domainEntity.get('GbDomainEntity');
//     if (gbDomainEntity == null) throw new Error();
//     expect(gbDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('GbPrimaryIdentity');
//     expect(gbDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('gb');
//     const gbDomainEntityFK = gbDomainEntity.data.edfiOdsRelational.odsTables[0].foreignKeys[0];
//     expect(gbDomainEntityFK.foreignTableId).toBe('EdfiDomainEntity');
//     expect(gbDomainEntityFK.foreignTableSchema).toBe('edfi');
//   });

//   it('should have sample ods table with reference to core', (): void => {
//     const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
//     if (namespace == null) throw new Error();
//     const sampleDomainEntity = namespace.entity.domainEntity.get('SampleDomainEntity');
//     if (sampleDomainEntity == null) throw new Error();
//     expect(sampleDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('SamplePrimaryIdentity');
//     expect(sampleDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('sample');
//     const sampleDomainEntityFK = sampleDomainEntity.data.edfiOdsRelational.odsTables[0].foreignKeys[0];
//     expect(sampleDomainEntityFK.foreignTableId).toBe('EdfiDomainEntity');
//     expect(sampleDomainEntityFK.foreignTableSchema).toBe('edfi');
//   });
// });
