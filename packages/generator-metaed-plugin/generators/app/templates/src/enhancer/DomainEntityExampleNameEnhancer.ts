import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, versionSatisfies, V3OrGreater } from '@edfi/metaed-core';

// Enhancer that populates example names for DomainEntities as their metaEdName with an 'Example' prefix
const enhancerName = 'DomainEntityExampleNameEnhancer';

// Enhancer only runs for Data Standard 3.x+, using canned SemVer range from metaed-core
const targetVersions: string = V3OrGreater;

// standard enhancer function signature
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // return if not Data Standard 3.0+
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  // Loop over all DomainEntities in all namespaces
  getAllEntitiesOfType(metaEd, 'domainEntity').forEach(entity => {
    // Set plugin-specific exampleName (initialized in the model code) to metaEdName with 'Example' prefix
    entity.data.orgExample.exampleName = `Example${entity.metaEdName}`;
  });

  return {
    enhancerName,
    success: true,
  };
}
