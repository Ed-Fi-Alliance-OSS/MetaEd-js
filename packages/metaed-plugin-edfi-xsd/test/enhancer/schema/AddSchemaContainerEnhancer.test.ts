import {
  newMetaEdEnvironment,
  newNamespace,
  newDomainEntity,
  newDomainEntitySubclass,
  newDomainEntityExtension,
  newDescriptor,
  newAssociation,
  newAssociationSubclass,
  newCommon,
  newEnumeration,
  newSchoolYearEnumeration,
  newMapTypeEnumeration,
  newDecimalType,
  newIntegerType,
  newStringType,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, SemVer, Namespace } from '@edfi/metaed-core';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { newComplexType, NoComplexType } from '../../../src/model/schema/ComplexType';
import { newEnumerationSimpleType, NoEnumerationSimpleType } from '../../../src/model/schema/EnumerationSimpleType';
import { newIntegerSimpleType } from '../../../src/model/schema/IntegerSimpleType';
import { newDecimalSimpleType } from '../../../src/model/schema/DecimalSimpleType';
import { newStringSimpleType } from '../../../src/model/schema/StringSimpleType';
import { SchemaSection } from '../../../src/model/schema/SchemaSection';
import { SchemaContainer } from '../../../src/model/schema/SchemaContainer';
import { NamespaceEdfiXsd } from '../../../src/model/Namespace';
import { enhance } from '../../../src/enhancer/schema/AddSchemaContainerEnhancer';
import { baseTypeDescriptorReference } from '../../../src/enhancer/schema/AddComplexTypesBaseEnhancer';

describe('when enhancing namespace info for core', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const namespaceName = 'EdFi';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };
  let createdSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespace: Namespace = { ...newNamespace(), namespaceName, data: { edfiXsd: {} } };
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

    enhance(metaEd);
    createdSchema = (coreNamespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema;
  });

  it('should have is extension assigned', (): void => {
    expect(createdSchema.isExtension).toBe(false);
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdSchema.schemaAnnotation.documentation).toContain('Ed-Fi-Core Version');
    expect(createdSchema.schemaAnnotation.documentation).toContain(dataStandardVersion);
  });

  it('should generate sections in correct order', (): void => {
    expect(createdSchema.sections.length).toBe(10);
    expect(createdSchema.sections[0].sectionAnnotation.documentation).toContain('Domain Entities');
    expect(createdSchema.sections[1].sectionAnnotation.documentation).toContain('Descriptors');
    expect(createdSchema.sections[2].sectionAnnotation.documentation).toContain('Associations');
    expect(createdSchema.sections[3].sectionAnnotation.documentation).toContain('Base Types (borrowed from NEIM standards)');
    expect(createdSchema.sections[4].sectionAnnotation.documentation).toContain('Extended Reference Types');
    expect(createdSchema.sections[5].sectionAnnotation.documentation).toContain('Extended Descriptor Reference Types');
    expect(createdSchema.sections[6].sectionAnnotation.documentation).toContain('Common Types');
    expect(createdSchema.sections[7].sectionAnnotation.documentation).toContain('Enumerations and Enumerated Collections');
    expect(createdSchema.sections[8].sectionAnnotation.documentation).toContain('String Simple Types');
    expect(createdSchema.sections[9].sectionAnnotation.documentation).toContain('Numeric Simple Types');
  });
});

describe('when enhancing namespace info for extension', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const namespaceName = 'EdFi';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };
  const extensionNamespaceName = 'extensionNamespace';
  const projectExtension = 'EXTENSION';
  let createdSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespace: Namespace = { ...newNamespace(), namespaceName, data: { edfiXsd: {} } };
    const extensionNamespace: Namespace = {
      ...newNamespace(),
      namespaceName: extensionNamespaceName,
      projectExtension,
      isExtension: true,
      data: { edfiXsd: {} },
    };
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    enhance(metaEd);
    createdSchema = (extensionNamespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema;
  });

  it('should have is extension assigned', (): void => {
    expect(createdSchema.isExtension).toBe(true);
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdSchema.schemaAnnotation.documentation).toContain('Extensions');
    expect(createdSchema.schemaAnnotation.documentation).toContain(dataStandardVersion);
  });

  it('should generate sections in correct order', (): void => {
    expect(createdSchema.sections.length).toBe(9);
    expect(createdSchema.sections[0].sectionAnnotation.documentation).toContain('Domain Entities');
    expect(createdSchema.sections[1].sectionAnnotation.documentation).toContain('Descriptors');
    expect(createdSchema.sections[2].sectionAnnotation.documentation).toContain('Associations');
    expect(createdSchema.sections[3].sectionAnnotation.documentation).toContain('Extended Reference Types');
    expect(createdSchema.sections[4].sectionAnnotation.documentation).toContain('Extended Descriptor Reference Types');
    expect(createdSchema.sections[5].sectionAnnotation.documentation).toContain('Common Types');
    expect(createdSchema.sections[6].sectionAnnotation.documentation).toContain('Enumerations and Enumerated Collections');
    expect(createdSchema.sections[7].sectionAnnotation.documentation).toContain('String Simple Types');
    expect(createdSchema.sections[8].sectionAnnotation.documentation).toContain('Numeric Simple Types');
  });
});

describe('when enhancing namespace info for core with children', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const namespaceName = 'EdFi';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };
  const extensionNamespaceName = 'extensionNamespace';
  const projectExtension = 'EXTENSION';

  // core namespace constants
  const domainEntity1Name = 'Domain Entity Name 1';
  const domainEntitySubclass1Name = 'Domain Entity Subclass Name 1';
  const domainEntityExtension1Name = 'Domain Entity Extension Name 1';

  const domainEntity1ComplexTypeName = 'Domain Entity Complex Type Name 1';
  const domainEntitySubclass1ComplexTypeName = 'Domain Entity Subclass Complex Type Name 1';
  const domainEntityExtension1ComplexTypeName = 'Domain Entity Extension Complex Type Name 1';

  const domainEntity1ReferenceTypeName = 'Domain Entity Reference Type Name 1';
  const domainEntitySubclass1ReferenceTypeName = 'Domain Entity Subclass Reference Type Name 1';
  const domainEntityExtension1ReferenceTypeName = 'Domain Entity Extension Reference Type Name 1';

  const domainEntity1LookupTypeName = 'Domain Entity Lookup Type Name 1';
  const domainEntitySubclass1LookupTypeName = 'Domain Entity Subclass Lookup Type Name 1';
  const domainEntityExtension1LookupTypeName = 'Domain Entity Extension Lookup Type Name 1';

  const domainEntity1IdentityTypeName = 'Domain Entity Identity Type Name 1';
  const domainEntitySubclass1IdentityTypeName = 'Domain Entity Subclass Identity Type Name 1';
  const domainEntityExtension1IdentityTypeName = 'Domain Entity Extension Identity Type Name 1';

  const descriptor1Name = 'Descriptor Name 1';
  const descriptor1ComplexTypeName = 'Descriptor Complex Type Name 1';
  const descriptor1ReferenceTypeName = 'Descriptor Reference Type Name 1';

  const association1Name = 'Association Name 1';
  const associationSubclass1Name = 'Association Subclass Name 1';

  const association1ComplexTypeName = 'Association Complex Type Name 1';
  const associationSubclass1ComplexTypeName = 'Association Subclass Complex Type Name 1';

  const association1ReferenceTypeName = 'Association Reference Type Name 1';
  const associationSubclass1ReferenceTypeName = 'Association Subclass Reference Type Name 1';

  const association1LookupTypeName = 'Association Lookup Type Name 1';
  const associationSubclass1LookupTypeName = 'Association Subclass Lookup Type Name 1';

  const association1IdentityTypeName = 'Association Identity Type Name 1';
  const associationSubclass1IdentityTypeName = 'Association Subclass Identity Type Name 1';

  const common1Name = 'Common Type Name 1';
  const inlineCommon1Name = 'Inline Common Type Name 1';
  const common1ComplexTypeName = 'Common Type Complex Type Name 1';
  const inlineCommon1ComplexTypeName = 'Inline Common Type Complex Type Name 1';

  const enumeration1Name = 'Enumeration Name 1';
  const schoolYearEnumeration1Name = 'School Year Enumeration Name 1';
  const xsdMapTypeEnumeration1Name = 'Xsd Map Type Enumeration Name 1';
  const enumeration1SimpleTypeName = 'Enumeration Simple Type Name 1';
  const schoolYearEnumeration1SimpleTypeName = 'School Year Enumeration Simple Type Name 1';
  const xsdMapTypeEnumeration1SimpleTypeName = 'Xsd Map Type Enumeration Simple Type Name 1';

  const stringType1Name = 'String Type Name 1';
  const stringType1SimpleTypeName = 'String Type Simple Type Name 1';

  const integerType1Name = 'Integer Type Name 1';
  const decimalType1Name = 'Decimal Type Name 1';
  const integerType1SimpleTypeName = 'Integer Type Simple Type Name 1';
  const decimalType1SimpleTypeName = 'Decimal Type Simple Type Name 1';

  // extension namespace constants
  const domainEntity2Name = 'Domain Entity Name 2';
  const domainEntitySubclass2Name = 'Domain Entity Subclass Name 2';
  const domainEntityExtension2Name = 'Domain Entity Extension Name 2';

  const domainEntity2ComplexTypeName = 'Domain Entity Complex Type Name 2';
  const domainEntitySubclass2ComplexTypeName = 'Domain Entity Subclass Complex Type Name 2';
  const domainEntityExtension2ComplexTypeName = 'Domain Entity Extension Complex Type Name 2';

  const domainEntity2ReferenceTypeName = 'Domain Entity Reference Type Name 2';
  const domainEntitySubclass2ReferenceTypeName = 'Domain Entity Subclass Reference Type Name 2';
  const domainEntityExtension2ReferenceTypeName = 'Domain Entity Extension Reference Type Name 2';

  const domainEntity2LookupTypeName = 'Domain Entity Lookup Type Name 2';
  const domainEntitySubclass2LookupTypeName = 'Domain Entity Subclass Lookup Type Name 2';
  const domainEntityExtension2LookupTypeName = 'Domain Entity Extension Lookup Type Name 2';

  const domainEntity2IdentityTypeName = 'Domain Entity Identity Type Name 2';
  const domainEntitySubclass2IdentityTypeName = 'Domain Entity Subclass Identity Type Name 2';
  const domainEntityExtension2IdentityTypeName = 'Domain Entity Extension Identity Type Name 2';

  const descriptor2Name = 'Descriptor Name 2';
  const descriptor2ComplexTypeName = 'Descriptor Complex Type Name 2';
  const descriptor2ReferenceTypeName = 'Descriptor Reference Type Name 2';

  const association2Name = 'Association Name 2';
  const associationSubclass2Name = 'Association Subclass Name 2';

  const association2ComplexTypeName = 'Association Complex Type Name 2';
  const associationSubclass2ComplexTypeName = 'Association Subclass Complex Type Name 2';

  const association2ReferenceTypeName = 'Association Reference Type Name 2';
  const associationSubclass2ReferenceTypeName = 'Association Subclass Reference Type Name 2';

  const association2LookupTypeName = 'Association Lookup Type Name 2';
  const associationSubclass2LookupTypeName = 'Association Subclass Lookup Type Name 2';

  const association2IdentityTypeName = 'Association Identity Type Name 2';
  const associationSubclass2IdentityTypeName = 'Association Subclass Identity Type Name 2';

  const common2Name = 'Common Type Name 2';
  const inlineCommon2Name = 'Inline Common Type Name 2';
  const common2ComplexTypeName = 'Common Type Complex Type Name 2';
  const inlineCommon2ComplexTypeName = 'Inline Common Type Complex Type Name 2';
  const commonExtension1Name = 'Common Extension Name 1';
  const commonExtension1ComplexTypeName = 'Common Extension Type Complex Type Name 1';

  const enumeration2Name = 'Enumeration Name 2';
  const schoolYearEnumeration2Name = 'School Year Enumeration Name 2';
  const xsdMapTypeEnumeration2Name = 'Xsd Map Type Enumeration Name 2';
  const enumeration2SimpleTypeName = 'Enumeration Simple Type Name 2';
  const schoolYearEnumeration2SimpleTypeName = 'School Year Enumeration Simple Type Name 2';
  const xsdMapTypeEnumeration2SimpleTypeName = 'Xsd Map Type Enumeration Simple Type Name 2';

  const stringType2Name = 'String Type Name 2';
  const stringType2SimpleTypeName = 'String Type Simple Type Name 2';

  const integerType2Name = 'Integer Type Name 2';
  const decimalType2Name = 'Decimal Type Name 2';
  const integerType2SimpleTypeName = 'Integer Type Simple Type Name 2';
  const decimalType2SimpleTypeName = 'Decimal Type Simple Type Name 2';

  let coreSchema: SchemaContainer;
  let extensionSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespace: Namespace = { ...newNamespace(), namespaceName, data: { edfiXsd: {} } };

    const extensionNamespace: Namespace = {
      ...newNamespace(),
      namespaceName: extensionNamespaceName,
      projectExtension,
      isExtension: true,
      data: { edfiXsd: {} },
    };
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
    extensionNamespace.dependencies.push(coreNamespace);

    const domainEntity1 = {
      ...newDomainEntity(),
      metaEdName: domainEntity1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: domainEntity1ComplexTypeName }, NoComplexType],
          xsdReferenceType: { ...newComplexType(), name: domainEntity1ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntity1LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntity1IdentityTypeName },
        },
      },
    };
    coreNamespace.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntityExtension1 = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntityExtension1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [NoComplexType, { ...newComplexType(), name: domainEntityExtension1ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: domainEntityExtension1ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntityExtension1LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntityExtension1IdentityTypeName },
        },
      },
    };
    coreNamespace.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    const domainEntitySubclass1 = {
      ...newDomainEntitySubclass(),
      metaEdName: domainEntitySubclass1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: domainEntitySubclass1ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: domainEntitySubclass1ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntitySubclass1LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntitySubclass1IdentityTypeName },
        },
      },
    };
    coreNamespace.entity.domainEntitySubclass.set(domainEntitySubclass1.metaEdName, domainEntitySubclass1);

    const descriptor1 = {
      ...newDescriptor(),
      metaEdName: descriptor1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: descriptor1ComplexTypeName }],
          xsdDescriptorExtendedReferenceType: { ...newStringSimpleType(), name: descriptor1ReferenceTypeName },
        },
      },
    };
    coreNamespace.entity.descriptor.set(descriptor1.metaEdName, descriptor1);

    const association1 = {
      ...newAssociation(),
      metaEdName: association1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: association1ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: association1ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: association1LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: association1IdentityTypeName },
        },
      },
    };
    coreNamespace.entity.association.set(association1.metaEdName, association1);

    const associationSubclass1 = {
      ...newAssociationSubclass(),
      metaEdName: associationSubclass1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: associationSubclass1ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: associationSubclass1ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: associationSubclass1LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: associationSubclass1IdentityTypeName },
        },
      },
    };
    coreNamespace.entity.associationSubclass.set(associationSubclass1.metaEdName, associationSubclass1);

    const common1 = {
      ...newCommon(),
      metaEdName: common1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: common1ComplexTypeName }],
        },
      },
    };
    coreNamespace.entity.common.set(common1.metaEdName, common1);

    const inlineCommon1 = {
      ...newCommon(),
      metaEdName: inlineCommon1Name,
      namespace: coreNamespace,
      inlineInOds: true,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: inlineCommon1ComplexTypeName }],
        },
      },
    };
    coreNamespace.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);

    const enumeration1 = {
      ...newEnumeration(),
      metaEdName: enumeration1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: enumeration1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.enumeration.set(enumeration1.metaEdName, enumeration1);

    const schoolYearEnumeration1 = {
      ...newSchoolYearEnumeration(),
      metaEdName: schoolYearEnumeration1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: schoolYearEnumeration1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.schoolYearEnumeration.set(schoolYearEnumeration1.metaEdName, schoolYearEnumeration1);

    const xsdMapTypeEnumeration1 = {
      ...newMapTypeEnumeration(),
      metaEdName: xsdMapTypeEnumeration1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: xsdMapTypeEnumeration1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.mapTypeEnumeration.set(xsdMapTypeEnumeration1.metaEdName, xsdMapTypeEnumeration1);

    const stringType1 = {
      ...newStringType(),
      metaEdName: stringType1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newStringSimpleType(), name: stringType1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.stringType.set(stringType1.metaEdName, stringType1);

    const integerType1 = {
      ...newIntegerType(),
      metaEdName: integerType1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newIntegerSimpleType(), name: integerType1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.integerType.set(integerType1.metaEdName, integerType1);

    const decimalType1 = {
      ...newDecimalType(),
      metaEdName: decimalType1Name,
      namespace: coreNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newDecimalSimpleType(), name: decimalType1SimpleTypeName },
        },
      },
    };
    coreNamespace.entity.decimalType.set(decimalType1.metaEdName, decimalType1);

    const domainEntity2 = {
      ...newDomainEntity(),
      metaEdName: domainEntity2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: domainEntity2ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: domainEntity2ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntity2LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntity2IdentityTypeName },
        },
      },
    };
    extensionNamespace.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    const domainEntityExtension2 = {
      ...newDomainEntityExtension(),
      metaEdName: domainEntityExtension2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: domainEntityExtension2ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: domainEntityExtension2ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntityExtension2LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntityExtension2IdentityTypeName },
        },
      },
    };
    extensionNamespace.entity.domainEntityExtension.set(domainEntityExtension2.metaEdName, domainEntityExtension2);

    const domainEntitySubclass2 = {
      ...newDomainEntitySubclass(),
      metaEdName: domainEntitySubclass2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: domainEntitySubclass2ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: domainEntitySubclass2ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: domainEntitySubclass2LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: domainEntitySubclass2IdentityTypeName },
        },
      },
    };
    extensionNamespace.entity.domainEntitySubclass.set(domainEntitySubclass2.metaEdName, domainEntitySubclass2);

    const descriptor2 = {
      ...newDescriptor(),
      metaEdName: descriptor2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: descriptor2ComplexTypeName }],
          xsdDescriptorExtendedReferenceType: { ...newStringSimpleType(), name: descriptor2ReferenceTypeName },
        },
      },
    };
    extensionNamespace.entity.descriptor.set(descriptor2.metaEdName, descriptor2);

    const association2 = {
      ...newAssociation(),
      metaEdName: association2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: association2ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: association2ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: association2LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: association2IdentityTypeName },
        },
      },
    };
    extensionNamespace.entity.association.set(association2.metaEdName, association2);

    const associationSubclass2 = {
      ...newAssociationSubclass(),
      metaEdName: associationSubclass2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: associationSubclass2ComplexTypeName }],
          xsdReferenceType: { ...newComplexType(), name: associationSubclass2ReferenceTypeName },
          xsdLookupType: { ...newComplexType(), name: associationSubclass2LookupTypeName },
          xsdIdentityType: { ...newComplexType(), name: associationSubclass2IdentityTypeName },
        },
      },
    };
    extensionNamespace.entity.associationSubclass.set(associationSubclass2.metaEdName, associationSubclass2);

    const common2 = {
      ...newCommon(),
      metaEdName: common2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: common2ComplexTypeName }],
        },
      },
    };
    extensionNamespace.entity.common.set(common2.metaEdName, common2);

    const commonExtension1 = {
      ...newCommon(),
      metaEdName: commonExtension1Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: commonExtension1ComplexTypeName }],
        },
      },
    };
    extensionNamespace.entity.common.set(commonExtension1.metaEdName, commonExtension1);

    const inlineCommon2 = {
      ...newCommon(),
      metaEdName: inlineCommon2Name,
      namespace: extensionNamespace,
      inlineInOds: true,
      data: {
        edfiXsd: {
          xsdComplexTypes: [{ ...newComplexType(), name: inlineCommon2ComplexTypeName }],
        },
      },
    };
    extensionNamespace.entity.common.set(inlineCommon2.metaEdName, inlineCommon2);

    const enumeration2 = {
      ...newEnumeration(),
      metaEdName: enumeration2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: enumeration2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.enumeration.set(enumeration2.metaEdName, enumeration2);

    const schoolYearEnumeration2 = {
      ...newSchoolYearEnumeration(),
      metaEdName: schoolYearEnumeration2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: schoolYearEnumeration2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.schoolYearEnumeration.set(schoolYearEnumeration2.metaEdName, schoolYearEnumeration2);

    const xsdMapTypeEnumeration2 = {
      ...newMapTypeEnumeration(),
      metaEdName: xsdMapTypeEnumeration2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: { ...newEnumerationSimpleType(), name: xsdMapTypeEnumeration2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.mapTypeEnumeration.set(xsdMapTypeEnumeration2.metaEdName, xsdMapTypeEnumeration2);

    const stringType2 = {
      ...newStringType(),
      metaEdName: stringType2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newStringSimpleType(), name: stringType2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.stringType.set(stringType2.metaEdName, stringType2);

    const integerType2 = {
      ...newIntegerType(),
      metaEdName: integerType2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newIntegerSimpleType(), name: integerType2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.integerType.set(integerType2.metaEdName, integerType2);

    const decimalType2 = {
      ...newDecimalType(),
      metaEdName: decimalType2Name,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newDecimalSimpleType(), name: decimalType2SimpleTypeName },
        },
      },
    };
    extensionNamespace.entity.decimalType.set(decimalType2.metaEdName, decimalType2);

    const domainEntityWithNoComplexTypes = {
      ...newDomainEntity(),
      metaEdName: 'DomainEntityWithNoComplexTypes',
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [NoComplexType],
          xsdReferenceType: NoComplexType,
          xsdLookupType: NoComplexType,
          xsdIdentityType: NoComplexType,
        },
      },
    };
    extensionNamespace.entity.domainEntity.set(domainEntityWithNoComplexTypes.metaEdName, domainEntityWithNoComplexTypes);

    const enumerationWithNoEnumerationSimpleType = {
      ...newEnumeration(),
      metaEdName: 'EnumerationWithNoEnumerationSimpleType',
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdEnumerationSimpleType: NoEnumerationSimpleType,
        },
      },
    };
    extensionNamespace.entity.enumeration.set(
      enumerationWithNoEnumerationSimpleType.metaEdName,
      enumerationWithNoEnumerationSimpleType,
    );

    const stringTypeWithNoSimpleType = {
      ...newStringType(),
      metaEdName: 'StringTypeWithNoSimpleType',
      namespace: extensionNamespace,
      data: {
        edfiXsd: {
          xsdSimpleType: NoSimpleType,
        },
      },
    };
    extensionNamespace.entity.stringType.set(stringTypeWithNoSimpleType.metaEdName, stringTypeWithNoSimpleType);

    enhance(metaEd);

    coreSchema = (coreNamespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema;
    extensionSchema = (extensionNamespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema;
  });

  it('should generate domain entities section', (): void => {
    const section: SchemaSection = coreSchema.sections[0];
    expect(section.complexTypes.length).toBe(3);
    expect(section.complexTypes[0].name).toBe(domainEntity1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(domainEntityExtension1ComplexTypeName);
    expect(section.complexTypes[2].name).toBe(domainEntitySubclass1ComplexTypeName);
  });

  it('should generate descriptor section', (): void => {
    const section: SchemaSection = coreSchema.sections[1];
    expect(section.complexTypes.length).toBe(1);
    expect(section.complexTypes[0].name).toBe(descriptor1ComplexTypeName);
  });

  it('should generate associations section', (): void => {
    const section: SchemaSection = coreSchema.sections[2];
    expect(section.complexTypes.length).toBe(2);
    expect(section.complexTypes[0].name).toBe(association1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(associationSubclass1ComplexTypeName);
  });

  it('should generate references section', (): void => {
    const section: SchemaSection = coreSchema.sections[4];
    expect(section.complexTypes.length).toBe(15);

    expect(section.complexTypes[0].name).toBe(association1IdentityTypeName);
    expect(section.complexTypes[1].name).toBe(association1LookupTypeName);
    expect(section.complexTypes[2].name).toBe(association1ReferenceTypeName);
    expect(section.complexTypes[3].name).toBe(associationSubclass1IdentityTypeName);
    expect(section.complexTypes[4].name).toBe(associationSubclass1LookupTypeName);
    expect(section.complexTypes[5].name).toBe(associationSubclass1ReferenceTypeName);
    expect(section.complexTypes[6].name).toBe(domainEntityExtension1IdentityTypeName);
    expect(section.complexTypes[7].name).toBe(domainEntityExtension1LookupTypeName);
    expect(section.complexTypes[8].name).toBe(domainEntityExtension1ReferenceTypeName);
    expect(section.complexTypes[9].name).toBe(domainEntity1IdentityTypeName);
    expect(section.complexTypes[10].name).toBe(domainEntity1LookupTypeName);
    expect(section.complexTypes[11].name).toBe(domainEntity1ReferenceTypeName);
    expect(section.complexTypes[12].name).toBe(domainEntitySubclass1IdentityTypeName);
    expect(section.complexTypes[13].name).toBe(domainEntitySubclass1LookupTypeName);
    expect(section.complexTypes[14].name).toBe(domainEntitySubclass1ReferenceTypeName);
  });

  it('should generate descriptor references section', (): void => {
    const section: SchemaSection = coreSchema.sections[5];
    expect(section.simpleTypes.length).toBe(1);
    expect(section.simpleTypes[0].name).toBe(descriptor1ReferenceTypeName);
  });

  it('should generate common types section', (): void => {
    const section: SchemaSection = coreSchema.sections[6];
    expect(section.complexTypes.length).toBe(2);
    expect(section.complexTypes[0].name).toBe(common1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(inlineCommon1ComplexTypeName);
  });

  it('should generate enumerations section', (): void => {
    const section: SchemaSection = coreSchema.sections[7];
    expect(section.simpleTypes.length).toBe(3);
    expect(section.simpleTypes[0].name).toBe(enumeration1SimpleTypeName);
    expect(section.simpleTypes[1].name).toBe(schoolYearEnumeration1SimpleTypeName);
    expect(section.simpleTypes[2].name).toBe(xsdMapTypeEnumeration1SimpleTypeName);
  });

  it('should generate common types section in extension', (): void => {
    const section: SchemaSection = extensionSchema.sections[5];
    expect(section.complexTypes.length).toBe(3);
    expect(section.complexTypes[0].name).toBe(commonExtension1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(common2ComplexTypeName);
    expect(section.complexTypes[2].name).toBe(inlineCommon2ComplexTypeName);
  });

  it('should generate string simple types section in extension without base types', (): void => {
    const section: SchemaSection = extensionSchema.sections[7];
    expect(section.simpleTypes.length).toBe(1);
    expect(section.simpleTypes[0].name).toBe(stringType2SimpleTypeName);
  });

  it('should generate string simple types section in core', (): void => {
    const section: SchemaSection = coreSchema.sections[8];
    expect(section.simpleTypes.length).toBe(4);
    expect(section.simpleTypes[0].name).toBe('CodeValue');
    expect(section.simpleTypes[1].name).toBe(baseTypeDescriptorReference);
    expect(section.simpleTypes[2].name).toBe(stringType1SimpleTypeName);
    expect(section.simpleTypes[3].name).toBe('TimeInterval');
  });

  it('should generate numeric simple types section in extension without base types', (): void => {
    const section: SchemaSection = extensionSchema.sections[8];
    expect(section.simpleTypes.length).toBe(2);
    expect(section.simpleTypes[0].name).toBe(decimalType2SimpleTypeName);
    expect(section.simpleTypes[1].name).toBe(integerType2SimpleTypeName);
  });

  it('should generate numeric simple types section in core', (): void => {
    const section: SchemaSection = coreSchema.sections[9];
    expect(section.simpleTypes.length).toBe(4);
    expect(section.simpleTypes[0].name).toBe('Currency');
    expect(section.simpleTypes[1].name).toBe(decimalType1SimpleTypeName);
    expect(section.simpleTypes[2].name).toBe(integerType1SimpleTypeName);
    expect(section.simpleTypes[3].name).toBe('Percent');
  });
});
