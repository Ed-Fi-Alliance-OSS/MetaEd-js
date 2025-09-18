// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// Simple example showing migration from JSON to Jsonnet
// This configuration is equivalent to a JSON config but with added benefits:
// - Comments for documentation
// - Variables to reduce duplication
// - Functions for creating similar rules

// Define a variable for the common namespace
local namespace = "EdFi";

// Define a helper function to create a rule
local createRule(ruleName, entityName, dataConfig) = {
  rule: ruleName,
  matches: {
    entity: "domainEntity",
    namespace: namespace,
    entityName: entityName,
  },
  data: dataConfig,
};

{
  // The config array contains all plugin rules
  config: [
    // First rule with inline data
    createRule("rule123", "Grade", {
      DataGoesHere: true,
      description: "Configuration for Grade entity",
    }),

    // Second rule with different data
    createRule("rule456", "Student", {
      DataGoesThere: true,
      description: "Configuration for Student entity",
    }),

    // A more complex rule that doesn't use the helper
    {
      rule: "specialRule",
      // This rule applies to all entities in the namespace
      matches: {
        entity: "domainEntity",
        namespace: namespace,
        core: true,
      },
      data: {
        applyToAll: true,
        setting: "value",
      },
    },
  ],
}