import { getAllTopLevelEntitiesForNamespaces, prependIndefiniteArticle, versionSatisfies } from 'metaed-core';
import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, Namespace } from 'metaed-core';
import { createSchemaComplexTypeItems } from '../enhancer/schema/XsdElementFromPropertyCreator';
import { newAnnotation } from '../model/schema/Annotation';
import { newComplexType, NoComplexType } from '../model/schema/ComplexType';
import { newElement } from '../model/schema/Element';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Temporary work around until lookup types fully disappear
const enhancerName = 'AddLookupTypesDiminisher';
const targetVersions = '*';

const typeGroup = 'Lookup';
const documentation = 'Encapsulates alternative attributes that can be used to look up the identity of {entity.metaEdName}.';
const lookupTypeNames: Array<string> = [
  'Assessment',
  'AssessmentFamily',
  'Course',
  'EducationOrganization',
  'EducationOrganizationNetwork',
  'EducationServiceCenter',
  'GradebookEntry',
  'LearningStandard',
  'LocalEducationAgency',
  'Parent',
  'Program',
  'School',
  'Section',
  'Session',
  'Staff',
  'StateEducationAgency',
  'Student',
];

const createLookupType = (entity: TopLevelEntity): ComplexType =>
  Object.assign(newComplexType(), {
    name: `${entity.data.edfiXsd.xsdMetaEdNameWithExtension()}${typeGroup}Type`,
    items: createSchemaComplexTypeItems(entity.queryableFields, '0', false),
    annotation: Object.assign(newAnnotation(), {
      documentation: documentation.replace('{entity.metaEdName}', prependIndefiniteArticle(entity.metaEdName)),
      typeGroup,
    }),
  });

const createReferenceTypeItem = (entity: TopLevelEntity, lookupType: ComplexType): Element =>
  Object.assign(newElement(), {
    name: `${entity.metaEdName}${typeGroup}`,
    type: lookupType.name,
    minOccurs: '0',
    annotation: Object.assign(newAnnotation(), {
      documentation: lookupType.annotation.documentation,
    }),
  });

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  getAllTopLevelEntitiesForNamespaces([coreNamespace])
    .filter(x => lookupTypeNames.includes(x.metaEdName))
    .forEach(entity => {
      const lookupType: ComplexType = createLookupType(entity);
      entity.data.edfiXsd.xsdLookupType = lookupType;

      const referenceType: Element = createReferenceTypeItem(entity, lookupType);
      if (entity.data.edfiXsd.xsdReferenceType === NoComplexType) {
        entity.data.edfiXsd.xsdReferenceType = Object.assign(newComplexType(), { items: [referenceType] });
      } else {
        entity.data.edfiXsd.xsdReferenceType.items.push(referenceType);
      }
    });

  return {
    enhancerName,
    success: true,
  };
}
