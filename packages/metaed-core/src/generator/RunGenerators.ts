// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { State } from '../State';
import { MetaEdPlugin } from '../plugin/MetaEdPlugin';

export async function execute(metaEdPlugin: MetaEdPlugin, state: State): Promise<void> {
  if (state.metaEd.namespace == null || state.metaEd.propertyIndex == null) return;

  // eslint-disable-next-line no-restricted-syntax
  for (const generator of metaEdPlugin.generator) {
    state.generatorResults.push(await generator(state.metaEd));
  }
}
