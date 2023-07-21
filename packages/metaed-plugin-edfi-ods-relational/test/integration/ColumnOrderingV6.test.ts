import {
  Association,
  AssociationBuilder,
  CommonBuilder,
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

describe('when StudentSchoolAssociation has a GraduationPlan and targeting ODS/API 6.1', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '4.0.0' };
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion: '6.1.0' });

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
        "StudentUniqueId",
        "SchoolId",
        "EntryDate",
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
        "StudentUniqueId",
        "SchoolId",
        "EntryDate",
        "AlternativeGraduationPlanTypeDescriptorId",
        "AlternativeEducationOrganizationId",
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
            "foreignTableColumnId": "StudentUniqueId",
            "parentTableColumnId": "StudentUniqueId",
          },
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
          Object {
            "foreignTableColumnId": "EntryDate",
            "parentTableColumnId": "EntryDate",
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
        "GraduationPlanTypeDescriptorId",
        "EducationOrganizationId",
        "SchoolYear",
      ]
    `);
  });
});

describe('when StudentSpecialEducationProgramAssociation has a Disability common and targeting ODS/API 6.1', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '4.0.0' };
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion: '6.1.0' });

  const associationName = 'StudentSpecialEducationProgramAssociation';
  const disabilityName = 'Disability';
  let namespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Student', 'doc')
      .withAssociationDomainEntityProperty('Program', 'doc')
      .withDateIdentity('BeginDate', 'doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc')
      .withCommonProperty(disabilityName, 'doc', false, true)
      .withEndAssociation()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '100')
      .withEndDomainEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('doc')
      .withStringIdentity('ProgramName', 'doc', '100')
      .withEndDomainEntity()

      .withStartCommon(disabilityName)
      .withDocumentation('doc')
      .withDescriptorIdentity('Disability', 'doc')
      .withDescriptorProperty('DisabilityDesignation', 'doc', false, true)
      .withEndCommon()

      .withStartDescriptor('Disability')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('DisabilityDesignation')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi') as Namespace;
    metaEdPluginEnhancers().forEach((enhancer: Enhancer) => {
      enhancer(metaEd);
    });
  });

  it('should have three tables for association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables).toHaveLength(3);
  });

  it('should have correct column order for main table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[0].columns.map((x) => x.columnId))
      .toMatchInlineSnapshot(`
      Array [
        "StudentUniqueId",
        "ProgramName",
        "BeginDate",
        "EducationOrganizationId",
      ]
    `);
  });

  it('should have correct foreign key order for main table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[0].foreignKeys.map((x) => x.columnPairs))
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "EducationOrganizationId",
            "parentTableColumnId": "EducationOrganizationId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "ProgramName",
            "parentTableColumnId": "ProgramName",
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
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[1].columns.map((x) => x.columnId))
      .toMatchInlineSnapshot(`
      Array [
        "DisabilityDescriptorId",
        "StudentUniqueId",
        "ProgramName",
        "BeginDate",
        "EducationOrganizationId",
      ]
    `);
  });

  it('should have correct foreign key order for sub table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[1].foreignKeys.map((x) => x.columnPairs))
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "DisabilityDescriptorId",
            "parentTableColumnId": "DisabilityDescriptorId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "StudentUniqueId",
            "parentTableColumnId": "StudentUniqueId",
          },
          Object {
            "foreignTableColumnId": "ProgramName",
            "parentTableColumnId": "ProgramName",
          },
          Object {
            "foreignTableColumnId": "BeginDate",
            "parentTableColumnId": "BeginDate",
          },
          Object {
            "foreignTableColumnId": "EducationOrganizationId",
            "parentTableColumnId": "EducationOrganizationId",
          },
        ],
      ]
    `);
  });

  it('should have correct column order for sub-sub table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[2].columns.map((x) => x.columnId))
      .toMatchInlineSnapshot(`
      Array [
        "DisabilityDescriptorId",
        "StudentUniqueId",
        "ProgramName",
        "BeginDate",
        "EducationOrganizationId",
        "DisabilityDesignationDescriptorId",
      ]
    `);
  });

  it('should have correct foreign key order for sub-sub table of association', (): void => {
    const studentSchoolAssociation: Association = namespace.entity.association.get(associationName) as Association;
    expect(studentSchoolAssociation.data.edfiOdsRelational.odsTables[2].foreignKeys.map((x) => x.columnPairs))
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "DisabilityDescriptorId",
            "parentTableColumnId": "DisabilityDescriptorId",
          },
          Object {
            "foreignTableColumnId": "StudentUniqueId",
            "parentTableColumnId": "StudentUniqueId",
          },
          Object {
            "foreignTableColumnId": "ProgramName",
            "parentTableColumnId": "ProgramName",
          },
          Object {
            "foreignTableColumnId": "BeginDate",
            "parentTableColumnId": "BeginDate",
          },
          Object {
            "foreignTableColumnId": "EducationOrganizationId",
            "parentTableColumnId": "EducationOrganizationId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "DisabilityDesignationDescriptorId",
            "parentTableColumnId": "DisabilityDesignationDescriptorId",
          },
        ],
      ]
    `);
  });
});

describe('when Session has an AcademicWeek collection and targeting ODS/API 6.1', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '4.0.0' };
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion: '6.1.0' });

  const entityName = 'Session';
  let namespace: Namespace;

  // Session has School in identity, and an AcademicWeek collection which also has School in identity
  // so this has an implicit column merge
  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '100')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityProperty('AcademicWeek', 'doc', false, true)
      .withEndAssociation()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AcademicWeek')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withStringIdentity('WeekIdentifier', 'doc', '100')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEndEnumeration()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi') as Namespace;
    metaEdPluginEnhancers().forEach((enhancer: Enhancer) => {
      enhancer(metaEd);
    });
  });

  it('should have two tables for entity', (): void => {
    const session: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(session.data.edfiOdsRelational.odsTables).toHaveLength(2);
  });

  it('should have correct column order for main table of entity', (): void => {
    const session: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(session.data.edfiOdsRelational.odsTables[0].columns.map((x) => x.columnId)).toMatchInlineSnapshot(`
      Array [
        "SessionName",
        "SchoolYear",
        "SchoolId",
      ]
    `);
  });

  it('should have correct foreign key order for main table of entity', (): void => {
    const session: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(session.data.edfiOdsRelational.odsTables[0].foreignKeys.map((x) => x.columnPairs)).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "SchoolYear",
            "parentTableColumnId": "SchoolYear",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
        ],
      ]
    `);
  });

  it('should have correct column order for sub table of entity', (): void => {
    const session: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(session.data.edfiOdsRelational.odsTables[1].columns.map((x) => x.columnId)).toMatchInlineSnapshot(`
      Array [
        "SessionName",
        "SchoolYear",
        "SchoolId",
        "WeekIdentifier",
      ]
    `);
  });

  it('should have correct foreign key order for sub table of entity', (): void => {
    const session: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(session.data.edfiOdsRelational.odsTables[1].foreignKeys.map((x) => x.columnPairs)).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "SessionName",
            "parentTableColumnId": "SessionName",
          },
          Object {
            "foreignTableColumnId": "SchoolYear",
            "parentTableColumnId": "SchoolYear",
          },
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "SchoolId",
            "parentTableColumnId": "SchoolId",
          },
          Object {
            "foreignTableColumnId": "WeekIdentifier",
            "parentTableColumnId": "WeekIdentifier",
          },
        ],
      ]
    `);
  });
});

describe('when Assessment has an AssessmentPerformanceLevel common and targeting ODS/API 6.1', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '4.0.0' };
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion: '6.1.0' });

  const entityName = 'Assessment';
  let namespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('AssessmentIdentifier', 'doc', '100')
      .withCommonProperty('AssessmentPerformanceLevel', 'doc', false, true)
      .withStringIdentity('Namespace', 'doc', '100')
      .withEndDomainEntity()

      .withStartCommon('AssessmentPerformanceLevel')
      .withDocumentation('doc')
      .withDescriptorIdentity('PerformanceLevel', 'doc')
      .withDescriptorIdentity('AssessmentReportingMethod', 'doc')
      .withEndCommon()

      .withStartDescriptor('PerformanceLevel')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('AssessmentReportingMethod')
      .withDocumentation('doc')
      .withEndDescriptor()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi') as Namespace;
    metaEdPluginEnhancers().forEach((enhancer: Enhancer) => {
      enhancer(metaEd);
    });
  });

  it('should have two tables for entity', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(entity.data.edfiOdsRelational.odsTables).toHaveLength(2);
  });

  it('should have correct column order for main table of entity', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(entity.data.edfiOdsRelational.odsTables[0].columns.map((x) => x.columnId)).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
        "Namespace",
      ]
    `);
  });

  it('should have correct foreign key order for main table of entity', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(entity.data.edfiOdsRelational.odsTables[0].foreignKeys.map((x) => x.columnPairs)).toMatchInlineSnapshot(
      `Array []`,
    );
  });

  it('should have correct column order for sub table of entity', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(entity.data.edfiOdsRelational.odsTables[1].columns.map((x) => x.columnId)).toMatchInlineSnapshot(`
      Array [
        "PerformanceLevelDescriptorId",
        "AssessmentReportingMethodDescriptorId",
        "AssessmentIdentifier",
        "Namespace",
      ]
    `);
  });

  it('should have correct foreign key order for sub table of entity', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(entityName) as DomainEntity;
    expect(entity.data.edfiOdsRelational.odsTables[1].foreignKeys.map((x) => x.columnPairs)).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "foreignTableColumnId": "PerformanceLevelDescriptorId",
            "parentTableColumnId": "PerformanceLevelDescriptorId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "AssessmentReportingMethodDescriptorId",
            "parentTableColumnId": "AssessmentReportingMethodDescriptorId",
          },
        ],
        Array [
          Object {
            "foreignTableColumnId": "AssessmentIdentifier",
            "parentTableColumnId": "AssessmentIdentifier",
          },
          Object {
            "foreignTableColumnId": "Namespace",
            "parentTableColumnId": "Namespace",
          },
        ],
      ]
    `);
  });
});
