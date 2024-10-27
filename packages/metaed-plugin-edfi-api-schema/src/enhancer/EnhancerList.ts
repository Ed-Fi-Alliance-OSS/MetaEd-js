import { Enhancer } from '@edfi/metaed-core';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from './SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from './ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from './ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from './ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from './SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from './PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from './SubclassPropertyCollectingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from './MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as jsonSchemaEnhancerForInsert } from './JsonSchemaEnhancerForInsert';
import { enhance as allJsonPathsMappingEnhancer } from './AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from './MergeJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from './MergeDirectiveEqualityConstraintEnhancer';
import { enhance as columnConflictEqualityConstraintEnhancer } from './ColumnConflictEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from './ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from './IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from './SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from './DocumentPathsMappingEnhancer';
import { enhance as identityJsonPathsEnhancer } from './IdentityJsonPathsEnhancer';
import { enhance as booleanNumericJsonPathsEnhancer } from './BooleanNumericJsonPathsEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from './ApiSchemaBuildingEnhancer';
import { enhance as queryFieldMappingEnhancer } from './QueryFieldMappingEnhancer';

export function enhancerList(): Enhancer[] {
  return [
    namespaceSetupEnhancer,
    entityPropertyApiSchemaDataSetupEnhancer,
    entityApiSchemaDataSetupEnhancer,
    subclassPropertyNamingCollisionEnhancer,
    referenceComponentEnhancer,
    apiPropertyMappingEnhancer,
    propertyCollectingEnhancer,
    subclassPropertyCollectingEnhancer,
    apiEntityMappingEnhancer,
    subclassApiEntityMappingEnhancer,
    mergeCoveringFlattenedIdentityPropertyEnhancer,
    jsonSchemaEnhancerForInsert,
    allJsonPathsMappingEnhancer,
    mergeJsonPathsMappingEnhancer,
    mergeDirectiveEqualityConstraintEnhancer,
    columnConflictEqualityConstraintEnhancer,
    resourceNameEnhancer,
    identityFullnameEnhancer,
    subclassIdentityFullnameEnhancer,
    documentPathsMappingEnhancer,
    queryFieldMappingEnhancer,
    identityJsonPathsEnhancer,
    booleanNumericJsonPathsEnhancer,
    apiSchemaBuildingEnhancer,
  ];
}
