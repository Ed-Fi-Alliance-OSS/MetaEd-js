// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiOdsSqlserver } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as edfiOdsPostrgresql } from '@edfi/metaed-plugin-edfi-ods-postgresql';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiXsd } from '@edfi/metaed-plugin-edfi-xsd';

import { initialize as edfiOdsapi } from '../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [
    edfiUnified(),
    edfiUnifiedAdvanced(),
    edfiXsd(),
    edfiOdsRelational(),
    edfiOdsSqlserver(),
    edfiOdsPostrgresql(),
    edfiOdsapi(),
  ];
}
