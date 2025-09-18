// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import fs from 'node:fs';
import { loadConfigurationFile, findConfigurationFile } from '../../src/plugin/JsonnetConfigLoader';

describe('JsonnetConfigLoader', () => {
  const testDir = path.join(__dirname, 'jsonnet-test-configs');

  beforeAll(async () => {
    // Create test directory
    await fs.promises.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up test directory
    await fs.promises.rm(testDir, { recursive: true, force: true });
  });

  describe('loadConfigurationFile', () => {
    it('should load a JSON configuration file', async () => {
      const jsonFile = path.join(testDir, 'test.config.json');
      const jsonContent = {
        config: [
          {
            rule: 'testRule',
            data: {
              value: 'test',
            },
          },
        ],
      };
      await fs.promises.writeFile(jsonFile, JSON.stringify(jsonContent, null, 2));

      const result = await loadConfigurationFile(jsonFile);
      expect(result).toEqual(jsonContent);
    });

    it('should load a Jsonnet configuration file with variables', async () => {
      const jsonnetFile = path.join(testDir, 'test.config.jsonnet');
      const jsonnetContent = `
        local defaultValue = "default";
        {
          config: [
            {
              rule: "testRule",
              data: {
                value: std.extVar("testVar"),
                defaultValue: defaultValue,
              },
            },
          ]
        }
      `;
      await fs.promises.writeFile(jsonnetFile, jsonnetContent);

      const result = await loadConfigurationFile(jsonnetFile, {
        externalVariables: {
          testVar: 'external-value',
        },
      });

      expect(result.config[0].data.value).toBe('external-value');
      expect(result.config[0].data.defaultValue).toBe('default');
    });

    it('should load a Jsonnet configuration with functions', async () => {
      const jsonnetFile = path.join(testDir, 'functions.config.jsonnet');
      const jsonnetContent = `
        local makeRule(name, value) = {
          rule: name,
          data: {
            value: value
          }
        };

        {
          config: [
            makeRule("rule1", "value1"),
            makeRule("rule2", "value2"),
          ]
        }
      `;
      await fs.promises.writeFile(jsonnetFile, jsonnetContent);

      const result = await loadConfigurationFile(jsonnetFile);

      expect(result.config).toHaveLength(2);
      expect(result.config[0].rule).toBe('rule1');
      expect(result.config[0].data.value).toBe('value1');
      expect(result.config[1].rule).toBe('rule2');
      expect(result.config[1].data.value).toBe('value2');
    });

    it('should load a Jsonnet configuration with conditionals', async () => {
      const jsonnetFile = path.join(testDir, 'conditional.config.jsonnet');
      const jsonnetContent = `
        local enableFeature = std.extVar("enableFeature") == "true";
        {
          config: [
            {
              rule: "baseRule",
              data: {
                enabled: true
              }
            },
          ] + if enableFeature then [
            {
              rule: "featureRule",
              data: {
                enabled: true
              }
            }
          ] else []
        }
      `;
      await fs.promises.writeFile(jsonnetFile, jsonnetContent);

      // Test with feature enabled
      const resultEnabled = await loadConfigurationFile(jsonnetFile, {
        externalVariables: {
          enableFeature: 'true',
        },
      });
      expect(resultEnabled.config).toHaveLength(2);
      expect(resultEnabled.config[1].rule).toBe('featureRule');

      // Test with feature disabled
      const resultDisabled = await loadConfigurationFile(jsonnetFile, {
        externalVariables: {
          enableFeature: 'false',
        },
      });
      expect(resultDisabled.config).toHaveLength(1);
    });

    it('should throw an error for invalid JSON', async () => {
      const jsonFile = path.join(testDir, 'invalid.config.json');
      await fs.promises.writeFile(jsonFile, '{ invalid json }');

      await expect(loadConfigurationFile(jsonFile)).rejects.toThrow('Failed to parse JSON configuration');
    });

    it('should throw an error for invalid Jsonnet', async () => {
      const jsonnetFile = path.join(testDir, 'invalid.config.jsonnet');
      await fs.promises.writeFile(jsonnetFile, '{ invalid jsonnet }}}');

      await expect(loadConfigurationFile(jsonnetFile)).rejects.toThrow('Failed to evaluate Jsonnet configuration');
    });

    it('should throw an error for unsupported file extension', async () => {
      const unsupportedFile = path.join(testDir, 'test.config.yml');
      await fs.promises.writeFile(unsupportedFile, 'test: value');

      await expect(loadConfigurationFile(unsupportedFile)).rejects.toThrow('Unsupported configuration file extension: .yml');
    });

    it('should throw an error for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.config.json');

      await expect(loadConfigurationFile(nonExistentFile)).rejects.toThrow('Configuration file not found');
    });
  });

  describe('findConfigurationFile', () => {
    it('should prefer .jsonnet over .json', async () => {
      const pluginName = 'testPlugin';
      const jsonFile = path.join(testDir, `${pluginName}.config.json`);
      const jsonnetFile = path.join(testDir, `${pluginName}.config.jsonnet`);

      await fs.promises.writeFile(jsonFile, '{}');
      await fs.promises.writeFile(jsonnetFile, '{}');

      const result = await findConfigurationFile(testDir, pluginName);
      expect(result).toBe(jsonnetFile);
    });

    it('should find .json when .jsonnet does not exist', async () => {
      const pluginName = 'onlyJson';
      const jsonFile = path.join(testDir, `${pluginName}.config.json`);

      await fs.promises.writeFile(jsonFile, '{}');

      const result = await findConfigurationFile(testDir, pluginName);
      expect(result).toBe(jsonFile);
    });

    it('should find .jsonnet when .json does not exist', async () => {
      const pluginName = 'onlyJsonnet';
      const jsonnetFile = path.join(testDir, `${pluginName}.config.jsonnet`);

      await fs.promises.writeFile(jsonnetFile, '{}');

      const result = await findConfigurationFile(testDir, pluginName);
      expect(result).toBe(jsonnetFile);
    });

    it('should return null when neither exists', async () => {
      const result = await findConfigurationFile(testDir, 'nonExistentPlugin');
      expect(result).toBeNull();
    });
  });
});
