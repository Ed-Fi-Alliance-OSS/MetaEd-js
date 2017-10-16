// @flow
import { newMetaEdEnvironment,
  newNamespaceInfo,
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
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../../metaed-core/index';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { newComplexType, NoComplexType } from '../../../src/model/schema/ComplexType';
import { newEnumerationSimpleType, NoEnumerationSimpleType } from '../../../src/model/schema/EnumerationSimpleType';
import { newIntegerSimpleType } from '../../../src/model/schema/IntegerSimpleType';
import { newDecimalSimpleType } from '../../../src/model/schema/DecimalSimpleType';
import { newStringSimpleType } from '../../../src/model/schema/StringSimpleType';
import type { SchemaSection } from '../../../src/model/schema/SchemaSection';
import type { SchemaContainer } from '../../../src/model/schema/SchemaContainer';
import type { NamespaceInfoEdfiXsd } from '../../../src/model/NamespaceInfo';
import { enhance } from '../../../src/enhancer/schema/AddSchemaContainerEnhancer';

describe('when enhancing namespace info for core', () => {
  const dataStandardVersion = '3.0';
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion });
  const namespaceName: string = 'edfi';
  let createdSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.namespaceInfo.push(coreNamespaceInfo);

    enhance(metaEd);
    createdSchema = ((coreNamespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
  });

  it('should have is extension assigned', () => {
    expect(createdSchema.isExtension).toBe(false);
  });

  it('should have annotation documentation assigned', () => {
    expect(createdSchema.schemaAnnotation.documentation).toContain('Ed-Fi-Core Version');
    expect(createdSchema.schemaAnnotation.documentation).toContain(dataStandardVersion);
  });

  it('should generate sections in correct order', () => {
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

describe('when enhancing namespace info for extension', () => {
  const dataStandardVersion = '3.0';
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion });
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';
  let createdSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiXsd: {} },
    });
    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
      data: { edfiXsd: {} },
    });
    metaEd.entity.namespaceInfo.push(coreNamespaceInfo, extensionNamespaceInfo);

    enhance(metaEd);
    createdSchema = ((extensionNamespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
  });

  it('should have is extension assigned', () => {
    expect(createdSchema.isExtension).toBe(true);
  });

  it('should have annotation documentation assigned', () => {
    expect(createdSchema.schemaAnnotation.documentation).toContain('Extensions');
    expect(createdSchema.schemaAnnotation.documentation).toContain(dataStandardVersion);
  });

  it('should generate sections in correct order', () => {
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

describe('when enhancing namespace info for core with children', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'edfi';
  const extensionNamespaceName: string = 'extensionNamespace';
  const projectExtension: string = 'EXTENSION';

  // core namespace constants
  const domainEntity1Name: string = 'Domain Entity Name 1';
  const domainEntitySubclass1Name: string = 'Domain Entity Subclass Name 1';
  const domainEntityExtension1Name: string = 'Domain Entity Extension Name 1';

  const domainEntity1ComplexTypeName: string = 'Domain Entity Complex Type Name 1';
  const domainEntitySubclass1ComplexTypeName: string = 'Domain Entity Subclass Complex Type Name 1';
  const domainEntityExtension1ComplexTypeName: string = 'Domain Entity Extension Complex Type Name 1';

  const domainEntity1ReferenceTypeName: string = 'Domain Entity Reference Type Name 1';
  const domainEntitySubclass1ReferenceTypeName: string = 'Domain Entity Subclass Reference Type Name 1';
  const domainEntityExtension1ReferenceTypeName: string = 'Domain Entity Extension Reference Type Name 1';

  const domainEntity1LookupTypeName: string = 'Domain Entity Lookup Type Name 1';
  const domainEntitySubclass1LookupTypeName: string = 'Domain Entity Subclass Lookup Type Name 1';
  const domainEntityExtension1LookupTypeName: string = 'Domain Entity Extension Lookup Type Name 1';

  const domainEntity1IdentityTypeName: string = 'Domain Entity Identity Type Name 1';
  const domainEntitySubclass1IdentityTypeName: string = 'Domain Entity Subclass Identity Type Name 1';
  const domainEntityExtension1IdentityTypeName: string = 'Domain Entity Extension Identity Type Name 1';

  const descriptor1Name: string = 'Descriptor Name 1';
  const descriptor1ComplexTypeName: string = 'Descriptor Complex Type Name 1';
  const descriptor1ReferenceTypeName: string = 'Descriptor Reference Type Name 1';

  const association1Name: string = 'Association Name 1';
  const associationSubclass1Name: string = 'Association Subclass Name 1';

  const association1ComplexTypeName: string = 'Association Complex Type Name 1';
  const associationSubclass1ComplexTypeName: string = 'Association Subclass Complex Type Name 1';

  const association1ReferenceTypeName: string = 'Association Reference Type Name 1';
  const associationSubclass1ReferenceTypeName: string = 'Association Subclass Reference Type Name 1';

  const association1LookupTypeName: string = 'Association Lookup Type Name 1';
  const associationSubclass1LookupTypeName: string = 'Association Subclass Lookup Type Name 1';

  const association1IdentityTypeName: string = 'Association Identity Type Name 1';
  const associationSubclass1IdentityTypeName: string = 'Association Subclass Identity Type Name 1';

  const common1Name: string = 'Common Type Name 1';
  const inlineCommon1Name: string = 'Inline Common Type Name 1';
  const common1ComplexTypeName: string = 'Common Type Complex Type Name 1';
  const inlineCommon1ComplexTypeName: string = 'Inline Common Type Complex Type Name 1';

  const enumeration1Name: string = 'Enumeration Name 1';
  const schoolYearEnumeration1Name: string = 'School Year Enumeration Name 1';
  const xsdMapTypeEnumeration1Name: string = 'Xsd Map Type Enumeration Name 1';
  const enumeration1SimpleTypeName: string = 'Enumeration Simple Type Name 1';
  const schoolYearEnumeration1SimpleTypeName: string = 'School Year Enumeration Simple Type Name 1';
  const xsdMapTypeEnumeration1SimpleTypeName: string = 'Xsd Map Type Enumeration Simple Type Name 1';

  const stringType1Name: string = 'String Type Name 1';
  const stringType1SimpleTypeName: string = 'String Type Simple Type Name 1';

  const integerType1Name: string = 'Integer Type Name 1';
  const decimalType1Name: string = 'Decimal Type Name 1';
  const integerType1SimpleTypeName: string = 'Integer Type Simple Type Name 1';
  const decimalType1SimpleTypeName: string = 'Decimal Type Simple Type Name 1';

  // extension namespace constants
  const domainEntity2Name: string = 'Domain Entity Name 2';
  const domainEntitySubclass2Name: string = 'Domain Entity Subclass Name 2';
  const domainEntityExtension2Name: string = 'Domain Entity Extension Name 2';

  const domainEntity2ComplexTypeName: string = 'Domain Entity Complex Type Name 2';
  const domainEntitySubclass2ComplexTypeName: string = 'Domain Entity Subclass Complex Type Name 2';
  const domainEntityExtension2ComplexTypeName: string = 'Domain Entity Extension Complex Type Name 2';

  const domainEntity2ReferenceTypeName: string = 'Domain Entity Reference Type Name 2';
  const domainEntitySubclass2ReferenceTypeName: string = 'Domain Entity Subclass Reference Type Name 2';
  const domainEntityExtension2ReferenceTypeName: string = 'Domain Entity Extension Reference Type Name 2';

  const domainEntity2LookupTypeName: string = 'Domain Entity Lookup Type Name 2';
  const domainEntitySubclass2LookupTypeName: string = 'Domain Entity Subclass Lookup Type Name 2';
  const domainEntityExtension2LookupTypeName: string = 'Domain Entity Extension Lookup Type Name 2';

  const domainEntity2IdentityTypeName: string = 'Domain Entity Identity Type Name 2';
  const domainEntitySubclass2IdentityTypeName: string = 'Domain Entity Subclass Identity Type Name 2';
  const domainEntityExtension2IdentityTypeName: string = 'Domain Entity Extension Identity Type Name 2';

  const descriptor2Name: string = 'Descriptor Name 2';
  const descriptor2ComplexTypeName: string = 'Descriptor Complex Type Name 2';
  const descriptor2ReferenceTypeName: string = 'Descriptor Reference Type Name 2';

  const association2Name: string = 'Association Name 2';
  const associationSubclass2Name: string = 'Association Subclass Name 2';

  const association2ComplexTypeName: string = 'Association Complex Type Name 2';
  const associationSubclass2ComplexTypeName: string = 'Association Subclass Complex Type Name 2';

  const association2ReferenceTypeName: string = 'Association Reference Type Name 2';
  const associationSubclass2ReferenceTypeName: string = 'Association Subclass Reference Type Name 2';

  const association2LookupTypeName: string = 'Association Lookup Type Name 2';
  const associationSubclass2LookupTypeName: string = 'Association Subclass Lookup Type Name 2';

  const association2IdentityTypeName: string = 'Association Identity Type Name 2';
  const associationSubclass2IdentityTypeName: string = 'Association Subclass Identity Type Name 2';

  const common2Name: string = 'Common Type Name 2';
  const inlineCommon2Name: string = 'Inline Common Type Name 2';
  const common2ComplexTypeName: string = 'Common Type Complex Type Name 2';
  const inlineCommon2ComplexTypeName: string = 'Inline Common Type Complex Type Name 2';

  const enumeration2Name: string = 'Enumeration Name 2';
  const schoolYearEnumeration2Name: string = 'School Year Enumeration Name 2';
  const xsdMapTypeEnumeration2Name: string = 'Xsd Map Type Enumeration Name 2';
  const enumeration2SimpleTypeName: string = 'Enumeration Simple Type Name 2';
  const schoolYearEnumeration2SimpleTypeName: string = 'School Year Enumeration Simple Type Name 2';
  const xsdMapTypeEnumeration2SimpleTypeName: string = 'Xsd Map Type Enumeration Simple Type Name 2';

  const stringType2Name: string = 'String Type Name 2';
  const stringType2SimpleTypeName: string = 'String Type Simple Type Name 2';

  const integerType2Name: string = 'Integer Type Name 2';
  const decimalType2Name: string = 'Decimal Type Name 2';
  const integerType2SimpleTypeName: string = 'Integer Type Simple Type Name 2';
  const decimalType2SimpleTypeName: string = 'Decimal Type Simple Type Name 2';

  let coreSchema: SchemaContainer;
  let extensionSchema: SchemaContainer;

  beforeAll(() => {
    const coreNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiXsd: {} },
    });

    const extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension,
      isExtension: true,
      data: { edfiXsd: {} },
    });
    metaEd.entity.namespaceInfo.push(coreNamespaceInfo, extensionNamespaceInfo);

    const domainEntity1 = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: domainEntity1ComplexTypeName }),
            NoComplexType,
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntity1ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntity1LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntity1IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntity1.metaEdName, domainEntity1);

    const domainEntityExtension1 = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityExtension1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            NoComplexType,
            Object.assign(newComplexType(), { name: domainEntityExtension1ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntityExtension1ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntityExtension1LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntityExtension1IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension1.metaEdName, domainEntityExtension1);

    const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntitySubclass1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: domainEntitySubclass1ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntitySubclass1ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntitySubclass1LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntitySubclass1IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntitySubclass.set(domainEntitySubclass1.metaEdName, domainEntitySubclass1);

    const descriptor1 = Object.assign(newDescriptor(), {
      metaEdName: descriptor1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: descriptor1ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: descriptor1ReferenceTypeName }),
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor1.metaEdName, descriptor1);

    const association1 = Object.assign(newAssociation(), {
      metaEdName: association1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: association1ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: association1ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: association1LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: association1IdentityTypeName }),
        },
      },
    });
    metaEd.entity.association.set(association1.metaEdName, association1);

    const associationSubclass1 = Object.assign(newAssociationSubclass(), {
      metaEdName: associationSubclass1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: associationSubclass1ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: associationSubclass1ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: associationSubclass1LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: associationSubclass1IdentityTypeName }),
        },
      },
    });
    metaEd.entity.associationSubclass.set(associationSubclass1.metaEdName, associationSubclass1);

    const common1 = Object.assign(newCommon(), {
      metaEdName: common1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: common1ComplexTypeName }),
          ],
        },
      },
    });
    metaEd.entity.common.set(common1.metaEdName, common1);

    const inlineCommon1 = Object.assign(newCommon(), {
      metaEdName: inlineCommon1Name,
      namespaceInfo: coreNamespaceInfo,
      inlineInOds: true,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: inlineCommon1ComplexTypeName }),
          ],
        },
      },
    });
    metaEd.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);

    const enumeration1 = Object.assign(newEnumeration(), {
      metaEdName: enumeration1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: enumeration1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.enumeration.set(enumeration1.metaEdName, enumeration1);

    const schoolYearEnumeration1 = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: schoolYearEnumeration1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: schoolYearEnumeration1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.schoolYearEnumeration.set(schoolYearEnumeration1.metaEdName, schoolYearEnumeration1);

    const xsdMapTypeEnumeration1 = Object.assign(newMapTypeEnumeration(), {
      metaEdName: xsdMapTypeEnumeration1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: xsdMapTypeEnumeration1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.mapTypeEnumeration.set(xsdMapTypeEnumeration1.metaEdName, xsdMapTypeEnumeration1);

    const stringType1 = Object.assign(newStringType(), {
      metaEdName: stringType1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newStringSimpleType(), { name: stringType1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.stringType.set(stringType1.metaEdName, stringType1);

    const integerType1 = Object.assign(newIntegerType(), {
      metaEdName: integerType1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newIntegerSimpleType(), { name: integerType1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.integerType.set(integerType1.metaEdName, integerType1);

    const decimalType1 = Object.assign(newDecimalType(), {
      metaEdName: decimalType1Name,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newDecimalSimpleType(), { name: decimalType1SimpleTypeName }),
        },
      },
    });
    metaEd.entity.decimalType.set(decimalType1.metaEdName, decimalType1);

    const domainEntity2 = Object.assign(newDomainEntity(), {
      metaEdName: domainEntity2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: domainEntity2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntity2ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntity2LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntity2IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntity2.metaEdName, domainEntity2);

    const domainEntityExtension2 = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityExtension2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: domainEntityExtension2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntityExtension2ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntityExtension2LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntityExtension2IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtension2.metaEdName, domainEntityExtension2);

    const domainEntitySubclass2 = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntitySubclass2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: domainEntitySubclass2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: domainEntitySubclass2ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: domainEntitySubclass2LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: domainEntitySubclass2IdentityTypeName }),
        },
      },
    });
    metaEd.entity.domainEntitySubclass.set(domainEntitySubclass2.metaEdName, domainEntitySubclass2);

    const descriptor2 = Object.assign(newDescriptor(), {
      metaEdName: descriptor2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: descriptor2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: descriptor2ReferenceTypeName }),
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor2.metaEdName, descriptor2);

    const association2 = Object.assign(newAssociation(), {
      metaEdName: association2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: association2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: association2ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: association2LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: association2IdentityTypeName }),
        },
      },
    });
    metaEd.entity.association.set(association2.metaEdName, association2);

    const associationSubclass2 = Object.assign(newAssociationSubclass(), {
      metaEdName: associationSubclass2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: associationSubclass2ComplexTypeName }),
          ],
          xsd_ReferenceType: Object.assign(newComplexType(), { name: associationSubclass2ReferenceTypeName }),
          xsd_LookupType: Object.assign(newComplexType(), { name: associationSubclass2LookupTypeName }),
          xsd_IdentityType: Object.assign(newComplexType(), { name: associationSubclass2IdentityTypeName }),
        },
      },
    });
    metaEd.entity.associationSubclass.set(associationSubclass2.metaEdName, associationSubclass2);

    const common2 = Object.assign(newCommon(), {
      metaEdName: common2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: common2ComplexTypeName }),
          ],
        },
      },
    });
    metaEd.entity.common.set(common2.metaEdName, common2);

    const inlineCommon2 = Object.assign(newCommon(), {
      metaEdName: inlineCommon2Name,
      namespaceInfo: extensionNamespaceInfo,
      inlineInOds: true,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), { name: inlineCommon2ComplexTypeName }),
          ],
        },
      },
    });
    metaEd.entity.common.set(inlineCommon2.metaEdName, inlineCommon2);

    const enumeration2 = Object.assign(newEnumeration(), {
      metaEdName: enumeration2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: enumeration2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.enumeration.set(enumeration2.metaEdName, enumeration2);

    const schoolYearEnumeration2 = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: schoolYearEnumeration2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: schoolYearEnumeration2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.schoolYearEnumeration.set(schoolYearEnumeration2.metaEdName, schoolYearEnumeration2);

    const xsdMapTypeEnumeration2 = Object.assign(newMapTypeEnumeration(), {
      metaEdName: xsdMapTypeEnumeration2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: Object.assign(newEnumerationSimpleType(), { name: xsdMapTypeEnumeration2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.mapTypeEnumeration.set(xsdMapTypeEnumeration2.metaEdName, xsdMapTypeEnumeration2);

    const stringType2 = Object.assign(newStringType(), {
      metaEdName: stringType2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newStringSimpleType(), { name: stringType2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.stringType.set(stringType2.metaEdName, stringType2);

    const integerType2 = Object.assign(newIntegerType(), {
      metaEdName: integerType2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newIntegerSimpleType(), { name: integerType2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.integerType.set(integerType2.metaEdName, integerType2);

    const decimalType2 = Object.assign(newDecimalType(), {
      metaEdName: decimalType2Name,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newDecimalSimpleType(), { name: decimalType2SimpleTypeName }),
        },
      },
    });
    metaEd.entity.decimalType.set(decimalType2.metaEdName, decimalType2);

    const domainEntityWithNoComplexTypes = Object.assign(newDomainEntity(), {
      metaEdName: 'DomainEntityWithNoComplexTypes',
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            NoComplexType,
          ],
          xsd_ReferenceType: NoComplexType,
          xsd_LookupType: NoComplexType,
          xsd_IdentityType: NoComplexType,
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityWithNoComplexTypes.metaEdName, domainEntityWithNoComplexTypes);

    const enumerationWithNoEnumerationSimpleType = Object.assign(newEnumeration(), {
      metaEdName: 'EnumerationWithNoEnumerationSimpleType',
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_EnumerationSimpleType: NoEnumerationSimpleType,
        },
      },
    });
    metaEd.entity.enumeration.set(enumerationWithNoEnumerationSimpleType.metaEdName, enumerationWithNoEnumerationSimpleType);

    const stringTypeWithNoSimpleType = Object.assign(newStringType(), {
      metaEdName: 'StringTypeWithNoSimpleType',
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_SimpleType: NoSimpleType,
        },
      },
    });
    metaEd.entity.stringType.set(stringTypeWithNoSimpleType.metaEdName, stringTypeWithNoSimpleType);

    enhance(metaEd);

    coreSchema = ((coreNamespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
    extensionSchema = ((extensionNamespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
  });


  it('should generate domain entities section', () => {
    const section: SchemaSection = coreSchema.sections[0];
    expect(section.complexTypes.length).toBe(3);
    expect(section.complexTypes[0].name).toBe(domainEntity1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(domainEntityExtension1ComplexTypeName);
    expect(section.complexTypes[2].name).toBe(domainEntitySubclass1ComplexTypeName);
  });

  it('should generate descriptor section', () => {
    const section: SchemaSection = coreSchema.sections[1];
    expect(section.complexTypes.length).toBe(1);
    expect(section.complexTypes[0].name).toBe(descriptor1ComplexTypeName);
  });

  it('should generate associations section', () => {
    const section: SchemaSection = coreSchema.sections[2];
    expect(section.complexTypes.length).toBe(2);
    expect(section.complexTypes[0].name).toBe(association1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(associationSubclass1ComplexTypeName);
  });

  it('should generate references section', () => {
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

  it('should generate descriptor references section', () => {
    const section: SchemaSection = coreSchema.sections[5];
    expect(section.complexTypes.length).toBe(1);
    expect(section.complexTypes[0].name).toBe(descriptor1ReferenceTypeName);
  });

  it('should generate common types section', () => {
    const section: SchemaSection = coreSchema.sections[6];
    expect(section.complexTypes.length).toBe(2);
    expect(section.complexTypes[0].name).toBe(common1ComplexTypeName);
    expect(section.complexTypes[1].name).toBe(inlineCommon1ComplexTypeName);
  });

  it('should generate enumerations section', () => {
    const section: SchemaSection = coreSchema.sections[7];
    expect(section.simpleTypes.length).toBe(3);
    expect(section.simpleTypes[0].name).toBe(enumeration1SimpleTypeName);
    expect(section.simpleTypes[1].name).toBe(schoolYearEnumeration1SimpleTypeName);
    expect(section.simpleTypes[2].name).toBe(xsdMapTypeEnumeration1SimpleTypeName);
  });

  it('should generate string simple types section in extension without base types', () => {
    const section: SchemaSection = extensionSchema.sections[7];
    expect(section.simpleTypes.length).toBe(1);
    expect(section.simpleTypes[0].name).toBe(stringType2SimpleTypeName);
  });

  it('should generate string simple types section in core', () => {
    const section: SchemaSection = coreSchema.sections[8];
    expect(section.simpleTypes.length).toBe(3);
    expect(section.simpleTypes[0].name).toBe('CodeValue');
    expect(section.simpleTypes[1].name).toBe(stringType1SimpleTypeName);
    expect(section.simpleTypes[2].name).toBe('TimeInterval');
  });

  it('should generate numeric simple types section in extension without base types', () => {
    const section: SchemaSection = extensionSchema.sections[8];
    expect(section.simpleTypes.length).toBe(2);
    expect(section.simpleTypes[0].name).toBe(decimalType2SimpleTypeName);
    expect(section.simpleTypes[1].name).toBe(integerType2SimpleTypeName);
  });

  it('should generate numeric simple types section in core', () => {
    const section: SchemaSection = coreSchema.sections[9];
    expect(section.simpleTypes.length).toBe(4);
    expect(section.simpleTypes[0].name).toBe('Currency');
    expect(section.simpleTypes[1].name).toBe(decimalType1SimpleTypeName);
    expect(section.simpleTypes[2].name).toBe(integerType1SimpleTypeName);
    expect(section.simpleTypes[3].name).toBe('Percent');
  });
});
