import type { MetaEdPlugin } from '@edfi/metaed-core';

import { validate as sourcePropertyAndTargetPropertyMustMatch } from './validator/MergeDirective/SourcePropertyAndTargetPropertyMustMatch';
import { validate as sourcePropertyPathStringsMustExist } from './validator/MergeDirective/SourcePropertyPathMustExist';
import { validate as targetPropertyPathStringsMustExist } from './validator/MergeDirective/TargetPropertyPathMustExist';
import { validate as outPathsToSameEntityMustHaveMergeDirectiveOrRoleName } from './validator/MergeScenarios/OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName';
import { validate as deprecatedEntityWarning } from './validator/Deprecated/DeprecatedEntityWarning';
import { validate as deprecatedEntityExtensionWarning } from './validator/Deprecated/DeprecatedEntityExtensionWarning';
import { validate as deprecatedEntitySubclassWarning } from './validator/Deprecated/DeprecatedEntitySubclassWarning';
import { validate as deprecatedPropertyWarning } from './validator/Deprecated/DeprecatedPropertyWarning';
import { validate as deprecatedDomainItemReferenceWarning } from './validator/Deprecated/DeprecatedDomainItemReferenceWarning';
import { validate as deprecatedInterchangeItemReferenceWarning } from './validator/Deprecated/DeprecatedInterchangeItemReferenceWarning';
import { validate as commonPropertyCollectionTargetMustContainIdentity } from './validator/CommonProperty/CommonPropertyCollectionTargetMustContainIdentity';
import { validate as selfReferencingPropertiesMustHaveRoleNameIfAllowed } from './validator/CrossProperty/SelfReferencingPropertiesMustHaveRoleNameIfAllowed';

export function initialize(): MetaEdPlugin {
  return {
    validator: [
      sourcePropertyPathStringsMustExist,
      targetPropertyPathStringsMustExist,
      sourcePropertyAndTargetPropertyMustMatch,
      outPathsToSameEntityMustHaveMergeDirectiveOrRoleName,
      deprecatedEntityWarning,
      deprecatedEntityExtensionWarning,
      deprecatedEntitySubclassWarning,
      deprecatedPropertyWarning,
      deprecatedDomainItemReferenceWarning,
      deprecatedInterchangeItemReferenceWarning,
      commonPropertyCollectionTargetMustContainIdentity,
      selfReferencingPropertiesMustHaveRoleNameIfAllowed,
    ],
    enhancer: [],
    generator: [],
    shortName: 'edfiUnifiedAdvanced',
  };
}
