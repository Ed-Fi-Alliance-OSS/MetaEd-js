import { SemVer, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace, newPluginEnvironment } from '@edfi/metaed-core';

export function metaEdEnvironmentForApiVersion(targetTechnologyVersion: SemVer): MetaEdEnvironment {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiOdsRelational', { ...newPluginEnvironment(), targetTechnologyVersion });
  return metaEd;
}

export function newCoreNamespace(): Namespace {
  return {
    ...newNamespace(),
    namespaceName: 'EdFi',
    isExtension: false,
    data: {
      edfiOdsRelational: {
        deleteTrackingTable: [],
        deleteTrackingTrigger: [],
        enableChangeTracking: [],
      },
    },
  };
}

export function newExtensionNamespace(namespaceName: string): Namespace {
  return {
    ...newNamespace(),
    namespaceName,
    isExtension: true,
    data: {
      edfiOdsRelational: {
        deleteTrackingTable: [],
        deleteTrackingTrigger: [],
        enableChangeTracking: [],
      },
    },
  };
}
