// @flow
import type { MetaEdEnvironment, EnhancerResult, EntityProperty } from 'metaed-core';
import { getAllProperties } from 'metaed-core';

const enhancerName: string = 'InheritedDocumentationCopyingEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    if (!property.documentationInherited) return;
    if (!Object.keys(property).includes('referencedEntity')) return;
    // basically any reference property or shared simple property
    const propertyWithReferencedEntity: any = property;
    propertyWithReferencedEntity.documentation = propertyWithReferencedEntity.referencedEntity.documentation;
  });

  return {
    enhancerName,
    success: true,
  };
}
