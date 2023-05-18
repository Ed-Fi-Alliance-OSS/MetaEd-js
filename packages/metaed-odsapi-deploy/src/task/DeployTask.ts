import { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';

export type DeployTask = (
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
) => Promise<boolean>;
