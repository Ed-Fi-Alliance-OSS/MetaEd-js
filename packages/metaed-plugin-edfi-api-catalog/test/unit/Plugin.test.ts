// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { initialize } from '../../src/index';

describe('metaed-plugin-edfi-api-catalog', () => {
  describe('when initializing the plugin', () => {
    it('should return a valid MetaEdPlugin', () => {
      const plugin = initialize();

      expect(plugin).toBeDefined();
      expect(plugin.shortName).toBe('edfiApiCatalog');
      expect(plugin.validator).toEqual([]);
      expect(plugin.enhancer).toEqual([]);
      expect(plugin.generator).toHaveLength(1);
      expect(plugin.configurationSchemas).toBeDefined();
    });
  });
});
