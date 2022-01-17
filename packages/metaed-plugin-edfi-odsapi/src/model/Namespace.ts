import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { DomainModelDefinition } from './apiModel/DomainModelDefinition';
import { newDomainModelDefinition } from './apiModel/DomainModelDefinition';
import { Aggregate } from './domainMetadata/Aggregate';
import { EducationOrganizationReference } from './educationOrganizationReferenceMetadata/EducationOrganizationReference';

export interface NamespaceEdfiOdsApi {
  domainModelDefinition: DomainModelDefinition;
  aggregates: Aggregate[];
  apiEducationOrganizationReferences: EducationOrganizationReference[];
}

const enhancerName = 'NamespaceSetupEnhancer';

export function addNamespaceEdfiOdsApiTo(namespace: Namespace) {
  if (namespace.data.edfiOdsApi == null) namespace.data.edfiOdsApi = {};

  Object.assign(namespace.data.edfiOdsApi, {
    domainModelDefinition: newDomainModelDefinition(),
    aggregates: [],
    apiEducationOrganizationReferences: [],
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    addNamespaceEdfiOdsApiTo(namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
