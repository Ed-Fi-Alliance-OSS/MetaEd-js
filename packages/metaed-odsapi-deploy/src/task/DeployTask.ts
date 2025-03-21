// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { DeployResult } from './DeployResult';

export type DeployTask = (
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
  _additionalMssqlScriptsDirectory?: string,
  _additionalPostgresScriptsDirectory?: string,
) => Promise<DeployResult>;
