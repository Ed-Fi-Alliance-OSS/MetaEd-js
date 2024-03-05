import { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { DeployResult } from './DeployResult';

export type DeployTask = (
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
) => Promise<DeployResult>;
