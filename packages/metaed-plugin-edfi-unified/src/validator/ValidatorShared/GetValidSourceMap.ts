// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { InterchangeItem, SourceMap } from '@edfi/metaed-core';

/**
 * Gets a valid source map with line information for an interchange item.
 * Falls back to alternative source maps when the primary metaEdName does not have valid location data.
 */
export function getValidSourceMap(item: InterchangeItem): SourceMap {
  if (item.sourceMap.metaEdName.line > 0) {
    return item.sourceMap.metaEdName;
  }
  if (item.sourceMap.referencedType.line > 0) {
    return item.sourceMap.referencedType;
  }
  return item.sourceMap.type;
}
