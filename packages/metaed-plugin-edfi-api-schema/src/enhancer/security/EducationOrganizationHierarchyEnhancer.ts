import { EnhancerResult, MetaEdEnvironment, Namespace, TopLevelEntity } from '@edfi/metaed-core';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(
      'EducationOrganizationHierarchyEnhancer: Fatal Error: EducationOrganization not found in EdFi Data Standard project',
    );
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.data.educationOrganizationHierarchy = {
      EducationOrganization: allEducationOrganizations.map((edOrg) => edOrg.metaEdName),
    };

    allEducationOrganizations.forEach((edOrgType) => {
      edOrgType.properties
        .filter((p) => p.type === 'domainEntity' && p.parentEntity.baseEntity === edfiEducationOrganization)
        .forEach((p) => {
          if (namespace.data.educationOrganizationHierarchy[p.metaEdName] === undefined) {
            namespace.data.educationOrganizationHierarchy[p.metaEdName] = [edOrgType.metaEdName];
          } else {
            namespace.data.educationOrganizationHierarchy[p.metaEdName].push(edOrgType.metaEdName);
          }
        });
    });
  });
  return {
    enhancerName: 'EducationOrganizationHierarchyEnhancer',
    success: true,
  };
}
