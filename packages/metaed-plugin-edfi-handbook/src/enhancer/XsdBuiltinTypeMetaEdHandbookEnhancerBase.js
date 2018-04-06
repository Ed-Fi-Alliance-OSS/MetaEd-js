// @flow
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlebars from 'handlebars';
import { newComplexType, newAnnotation } from 'metaed-plugin-edfi-xsd';
import type { ComplexType } from 'metaed-plugin-edfi-xsd';
import type { EntityProperty } from 'metaed-core';
import type { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';

function getCardinalityStringFor(property: EntityProperty, isHandbookEntityReferenceProperty: boolean = false): string {
  if (isHandbookEntityReferenceProperty && (property.isRequired || property.isPartOfIdentity || property.isIdentityRename))
    return 'required';
  if (property.isPartOfIdentity) return 'identity';
  if (property.isRequired) return 'required';
  if (property.isRequiredCollection) return 'required collection';
  if (property.isOptional) return 'optional';
  if (property.isOptionalCollection) return 'optional collection';
  return 'UNKNOWN CARDINALITY';
}

function propertyNamer(property: EntityProperty): string {
  return property.withContext === property.metaEdName ? property.metaEdName : property.withContext + property.metaEdName;
}

function parentNameAndPropertyCardinality(property: EntityProperty): string {
  return `${property.parentEntityName}.${propertyNamer(property)} (as ${getCardinalityStringFor(property)})`;
}

function getPropertyName(property: EntityProperty): string {
  const nameRuleExeptions: Array<string> = ['BeginDate', 'AsOfDate', 'EndDate'];
  if (nameRuleExeptions.includes(property.metaEdName)) return `${property.metaEdName} (${property.parentEntity.metaEdName})`;
  return property.metaEdName;
}

// TODO: finish once ods is up and running.
// eslint-disable-next-line
function generatedTableSqlFor(property: EntityProperty, columnDatatype: string): Array<string> {
  return [`${property.metaEdName} ${columnDatatype}`];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const registerPartials: () => void = ramda.once(() => {
  handlebars.registerPartial({
    complexTypeItem: getTemplateString('complexTypeItem'),
    annotation: getTemplateString('annotation'),
  });
});

const getComplexTypeTemplate: () => () => string = ramda.once(() => handlebars.compile(getTemplateString('complexType')));

function calculateMinOccurs(property: EntityProperty, minOccursOverride: string): string {
  return minOccursOverride || (property.isOptional || property.isOptionalCollection) ? '0' : '';
}

function calculateMaxOccursIsUnbounded(property: EntityProperty, maxOccursIsUnboundedOverride: ?boolean): boolean {
  return maxOccursIsUnboundedOverride !== null
    ? ((maxOccursIsUnboundedOverride: any): boolean)
    : property.isOptionalCollection || property.isRequiredCollection;
}

function createXsdElementFromProperty(
  property: EntityProperty,
  minOccursOverride: string = '',
  maxOccursIsUnboundedOverride: ?boolean = null,
): ComplexType {
  return Object.assign({}, newComplexType(), {
    name: property.data.edfiXsd.xsd_Name,
    type: property.data.edfiXsd.xsd_Type,
    annotation: Object.assign(newAnnotation(), {
      documentation: property.documentation,
      descriptorName: property.data.edfiXsd.Xsd_DescriptorNameWithExtension || '',
    }),
    minOccurs: calculateMinOccurs(property, minOccursOverride),
    maxOccursIsUnbounded: calculateMaxOccursIsUnbounded(property, maxOccursIsUnboundedOverride),
  });
}

function generatedXsdFor(property: EntityProperty): string {
  registerPartials();
  const element: ComplexType = createXsdElementFromProperty(property);
  const template: any => string = getComplexTypeTemplate();
  return template(element);
}

export function createDefaultHandbookEntry(
  property: EntityProperty,
  entityTypeName: string,
  columnDatatype: string,
): HandbookEntry {
  return Object.assign(newHandbookEntry(), {
    definition: property.documentation,
    edFiId: property.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: property.metaEdName + property.metaEdId,
    entityType: entityTypeName,
    modelReferencesUsedBy: [parentNameAndPropertyCardinality(property)],
    name: getPropertyName(property),
    odsFragment: generatedTableSqlFor(property, columnDatatype),
    optionList: [],
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(property),
  });
}
