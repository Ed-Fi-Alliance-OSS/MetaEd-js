// @flow
import R from 'ramda';
import type { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '../../../../metaed-core/index';
import { getEntitiesOfType } from '../../../../metaed-core/index';
import type { TopLevelEntityEdfiXsd } from '../../model/TopLevelEntity';
import type { NamespaceInfoEdfiXsd } from '../../../src/model/NamespaceInfo';
import type { EnumerationBase, EnumerationBaseEdfiXsd } from '../../../src/model/EnumerationBase';
import type { SimpleTypeBase, SimpleTypeBaseEdfiXsd } from '../../../src/model/SimpleTypeBase';
import type { SchemaContainer } from '../../model/schema/SchemaContainer';
import { newSchemaContainer } from '../../model/schema/SchemaContainer';
import type { SchemaSection } from '../../model/schema/SchemaSection';
import { newSchemaSection } from '../../model/schema/SchemaSection';
import { newAnnotation } from '../../model/schema/Annotation';
import { newAttribute } from '../../model/schema/Attribute';
import { newElement } from '../../model/schema/Element';
import { NoComplexType, newComplexType } from '../../model/schema/ComplexType';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { NoEnumerationSimpleType } from '../../model/schema/EnumerationSimpleType';
import {
  createCodeValueSimpleType,
  createTimeIntervalSimpleType,
  createCurrencySimpleType,
  createPercentSimpleType,
} from './BaseSimpleTypeCreator';

const enhancerName: string = 'AddSchemaContainerEnhancer';

const complexTypesFrom = R.chain((x: TopLevelEntity) => ((x.data.edfiXsd: any): TopLevelEntityEdfiXsd).xsd_ComplexTypes);
const referenceTypesFrom = R.map((x: TopLevelEntity) => ((x.data.edfiXsd: any): TopLevelEntityEdfiXsd).xsd_ReferenceType);
const simpleTypesFrom = R.map((x: SimpleTypeBase) => ((x.data.edfiXsd: any): SimpleTypeBaseEdfiXsd).xsd_SimpleType);
const enumerationSimpleTypesFrom = R.map((x: EnumerationBase) => ((x.data.edfiXsd: any): EnumerationBaseEdfiXsd).xsd_EnumerationSimpleType);
const manyReferenceTypesFrom = R.chain((x: TopLevelEntity) => {
  const edfiXsd = ((x.data.edfiXsd: any): TopLevelEntityEdfiXsd);
  return [edfiXsd.xsd_IdentityType, edfiXsd.xsd_LookupType, edfiXsd.xsd_ReferenceType];
});

const removeNoComplexType = R.filter(x => x !== NoComplexType);
const removeNoSimpleType = R.filter(x => x !== NoSimpleType);
const removeNoEnumerationSimpleType = R.filter(x => x !== NoEnumerationSimpleType);

export const orderByName = R.sortBy(R.compose(R.toLower, R.prop('name')));
const inNamespace = namespaceInfo => R.filter(x => x.namespaceInfo.namespace === namespaceInfo.namespace);

function baseSchemaSection() {
  const schemaSection: SchemaSection = Object.assign(newSchemaSection(), {
    sectionAnnotation: Object.assign(newAnnotation(), {
      documentation: '===== Base Types (borrowed from NEIM standards) =====',
    }),
  });

  const complexObjectType = Object.assign(newComplexType(), {
    name: 'ComplexObjectType',
    isAbstract: true,
    annotation: Object.assign(newAnnotation(), {
      documentation: 'This is the base type from which all entity elements are extended.',
      typeGroup: 'Base',
    }),
    attributes: [
      Object.assign(newAttribute(), {
        name: 'id',
        type: 'xs:ID',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The XML ID associated with the complex object.',
        }),
      }),
    ],
  });
  schemaSection.complexTypes.push(complexObjectType);

  const descriptorReferenceType = Object.assign(newComplexType(), {
    name: 'DescriptorReferenceType',
    baseType: 'ReferenceType',
    annotation: Object.assign(newAnnotation(), {
      documentation: 'Provides references for descriptors during interchange. Use XML IDREF to reference a descriptor record that is included in the interchange. To lookup when already loaded, specify the full URI or the final segment of the URI.',
      typeGroup: 'Base',
    }),
    items: [
      Object.assign(newElement(), {
        name: 'CodeValue',
        type: 'CodeValue',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'A globally unique identifier within this descriptor type.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'Namespace',
        type: 'URI',
        minOccurs: '0',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'An optional globally unique namespace that identifies this descriptor set. If supplied, the author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary. Actual usage of this element for matching descriptors will be system-specific.',
        }),
      }),
    ],
  });
  schemaSection.complexTypes.push(descriptorReferenceType);

  const descriptorType = Object.assign(newComplexType(), {
    name: 'DescriptorType',
    baseType: 'ComplexObjectType',
    isAbstract: true,
    annotation: Object.assign(newAnnotation(), {
      documentation: 'This is the base for the Descriptor type.',
      typeGroup: 'Base',
    }),
    items: [
      Object.assign(newElement(), {
        name: 'CodeValue',
        type: 'CodeValue',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'A code or abbreviation that is used to refer to the descriptor.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'ShortDescription',
        type: 'ShortDescription',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'A shortened description for the descriptor.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'Description',
        type: 'Description',
        minOccurs: '0',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The description of the descriptor.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'EffectiveBeginDate',
        type: 'xs:date',
        minOccurs: '0',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'EffectiveEndDate',
        type: 'xs:date',
        minOccurs: '0',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The end date of the period when the descriptor is in effect.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'PriorDescriptor',
        type: 'DescriptorReferenceType',
        minOccurs: '0',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'Immediately prior to the date in Effective Date, the reference to the equivalent descriptor.',
        }),
      }),
      Object.assign(newElement(), {
        name: 'Namespace',
        type: 'URI',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'A globally unique identifier for this descriptor.',
        }),
      }),
    ],
  });
  schemaSection.complexTypes.push(descriptorType);

  const referenceType = Object.assign(newComplexType(), {
    name: 'ReferenceType',
    annotation: Object.assign(newAnnotation(), {
      documentation: 'This is the base type for association references.',
      typeGroup: 'Base',
    }),
    attributes: [
      Object.assign(newAttribute(), {
        name: 'id',
        type: 'xs:ID',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The XML ID associated with this complex object.',
        }),
      }),
      Object.assign(newAttribute(), {
        name: 'ref',
        type: 'xs:IDREF',
        annotation: Object.assign(newAnnotation(), {
          documentation: 'The XML IDREF that references the object associated with this object.',
        }),
      }),
    ],
  });
  schemaSection.complexTypes.push(referenceType);

  return schemaSection;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const versionString = metaEd.dataStandardVersion;
    const schemaContainer: SchemaContainer = Object.assign(newSchemaContainer(), {
      isExtension: namespaceInfo.isExtension,
      schemaAnnotation: Object.assign(newAnnotation(), {
        documentation: namespaceInfo.isExtension ? `===== Ed-Fi ${versionString} Extensions =====` : `===== Ed-Fi-Core Version ${versionString} ====`,
      }),
    });

    const complexTypesForEntitiesOfType = R.pipe(
      getEntitiesOfType,
      inNamespace(namespaceInfo),
      complexTypesFrom,
      removeNoComplexType,
      orderByName,
    );

    // Domain Entities
    const domainEntitiesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Domain Entities =====',
      }),
      complexTypes: complexTypesForEntitiesOfType(metaEd.entity, 'domainEntity', 'domainEntityExtension', 'domainEntitySubclass'),
    });
    schemaContainer.sections.push(domainEntitiesSection);

    // Descriptors
    const descriptorsSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Descriptors =====',
      }),
      complexTypes: complexTypesForEntitiesOfType(metaEd.entity, 'descriptor'),
    });
    schemaContainer.sections.push(descriptorsSection);

    // Associations
    const associationsSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Associations =====',
      }),
      complexTypes: complexTypesForEntitiesOfType(metaEd.entity, 'association', 'associationExtension', 'associationSubclass'),
    });
    schemaContainer.sections.push(associationsSection);

    // Base Types
    if (!namespaceInfo.isExtension) schemaContainer.sections.push(baseSchemaSection());

    // Extended Reference Types
    const manyReferenceTypesForEntitiesOfType = R.pipe(
      getEntitiesOfType,
      inNamespace(namespaceInfo),
      manyReferenceTypesFrom,
      removeNoComplexType,
      orderByName,
    );

    const extendedReferencesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Extended Reference Types =====',
      }),
      complexTypes: manyReferenceTypesForEntitiesOfType(metaEd.entity, 'association', 'associationExtension', 'associationSubclass', 'domainEntity', 'domainEntityExtension', 'domainEntitySubclass'),
    });
    schemaContainer.sections.push(extendedReferencesSection);

    // Extended Descriptor Reference Types
    const referenceTypesForEntitiesOfType = R.pipe(
      getEntitiesOfType,
      inNamespace(namespaceInfo),
      referenceTypesFrom,
      removeNoComplexType,
      orderByName,
    );

    const descriptorExtendedReferencesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Extended Descriptor Reference Types =====',
      }),
      complexTypes: referenceTypesForEntitiesOfType(metaEd.entity, 'descriptor'),
    });
    schemaContainer.sections.push(descriptorExtendedReferencesSection);

    // Common Types
    const commonTypesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Common Types =====',
      }),
      complexTypes: complexTypesForEntitiesOfType(metaEd.entity, 'common'),
    });
    schemaContainer.sections.push(commonTypesSection);

    // Enumerations and Enumerated Collections
    const enumerationSimpleTypesForEntitiesOfType = R.pipe(
      getEntitiesOfType,
      inNamespace(namespaceInfo),
      enumerationSimpleTypesFrom,
      removeNoEnumerationSimpleType,
      orderByName,
    );

    const enumerationsSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Enumerations and Enumerated Collections =====',
      }),
      simpleTypes: enumerationSimpleTypesForEntitiesOfType(metaEd.entity, 'enumeration', 'mapTypeEnumeration', 'schoolYearEnumeration'),
    });
    schemaContainer.sections.push(enumerationsSection);

    // String Simple Types
    const simpleTypesForEntitiesOfType = R.pipe(
      getEntitiesOfType,
      inNamespace(namespaceInfo),
      simpleTypesFrom,
      removeNoSimpleType,
    );

    const stringSimpleTypes = simpleTypesForEntitiesOfType(metaEd.entity, 'stringType');
    if (!namespaceInfo.isExtension) {
      stringSimpleTypes.push(createCodeValueSimpleType(), createTimeIntervalSimpleType());
    }

    const stringSimpleTypesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== String Simple Types =====',
      }),
      simpleTypes: orderByName(stringSimpleTypes),
    });

    schemaContainer.sections.push(stringSimpleTypesSection);

    // Numeric Simple Types
    const numericSimpleTypes = simpleTypesForEntitiesOfType(metaEd.entity, 'decimalType', 'integerType');
    if (!namespaceInfo.isExtension) {
      numericSimpleTypes.push(createCurrencySimpleType(), createPercentSimpleType());
    }

    const numericSimpleTypesSection: SchemaSection = Object.assign(newSchemaSection(), {
      sectionAnnotation: Object.assign(newAnnotation(), {
        documentation: '===== Numeric Simple Types =====',
      }),
      simpleTypes: orderByName(numericSimpleTypes),
    });

    schemaContainer.sections.push(numericSimpleTypesSection);

    ((namespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema = schemaContainer;
  });

  return {
    enhancerName,
    success: true,
  };
}
