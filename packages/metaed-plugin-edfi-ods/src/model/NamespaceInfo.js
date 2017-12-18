// @flow
import type { EnhancerResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { newSchemaContainer } from './database/SchemaContainer';
import type { SchemaContainer } from './database/SchemaContainer';

export type NamespaceInfoEdfiOds = {
  ods_Schema: SchemaContainer;
};

const enhancerName: string = 'NamespaceInfoSetupEnhancer';

export function addNamespaceInfoEdfiOdsTo(namespaceInfo: NamespaceInfo) {
  if (namespaceInfo.data.edfiOds == null) namespaceInfo.data.edfiOds = {};

  Object.assign(namespaceInfo.data.edfiOds, {
    ods_Schema: newSchemaContainer(),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.namespaceInfo.forEach((namespaceInfo: NamespaceInfo) => {
    addNamespaceInfoEdfiOdsTo(namespaceInfo);
  });

  return {
    enhancerName,
    success: true,
  };
}
