import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EducationOrganizationHierarchy } from '../../model/EducationOrganizationHierarchy';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.data.educationOrganizationHierarchy = {
      EducationOrganization: [
        'School',
        'LocalEducationAgency',
        'EducationServiceCenter',
        'CommunityOrganization',
        'CommunityProvider',
      ],
    } as EducationOrganizationHierarchy;
  });
  return {
    enhancerName: 'EducationOrganizationHierarchyElementEnhancer',
    success: true,
  };
}
