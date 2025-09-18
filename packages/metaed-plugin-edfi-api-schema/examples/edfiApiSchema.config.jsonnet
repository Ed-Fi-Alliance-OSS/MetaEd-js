// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// Example Jsonnet configuration for Ed-Fi API Schema plugin
// This demonstrates the power of Jsonnet for managing complex configurations

// Define reusable functions for creating rules
local makeSecurityRule(entity, property, identityProp, desc, versionRange=">=4.0.0") = {
  rule: "educationOrganizationSecurableElements",
  matches: {
    entity: "domainEntity",
    namespace: "EdFi",
    entityName: entity,
  },
  data: {
    versionRange: versionRange,
    securableElements: [
      {
        propertyPath: property,
        requiredIdentityProperty: identityProp,
        description: desc,
      },
    ],
  },
};

// Define common version ranges
local v3_3 = ">=3.3.0-a";
local v4_0 = ">=4.0.0";
local v4_0_alpha = ">=4.0.0-a";
local v5_0 = ">=5.0.0";

// Configuration can be controlled via external variables
local enableExperimentalFeatures = std.extVar("ENABLE_EXPERIMENTAL") == "true";

{
  config: [
    // Standard security rules
    makeSecurityRule(
      "DisciplineAction",
      "ResponsibilitySchool",
      "SchoolId",
      "Maps ResponsibilitySchool reference to SchoolId for security",
      v4_0_alpha
    ),

    makeSecurityRule(
      "StudentAssessment",
      "ReportedSchool",
      "SchoolId",
      "Maps ReportedSchool reference to SchoolId for security",
      v4_0
    ),

    // Special case with replace mode
    {
      rule: "educationOrganizationSecurableElements",
      matches: {
        entity: "domainEntitySubclass",
        namespace: "EdFi",
        entityName: "OrganizationDepartment",
      },
      data: {
        versionRange: v3_3,
        mode: "replace",
        securableElements: [
          {
            propertyPath: "ParentEducationOrganization",
            requiredIdentityProperty: "EducationOrganizationId",
            description: "Replaces default security to use parent organization",
          },
        ],
      },
    },

    // Identity-based security configuration
    {
      rule: "educationOrganizationIdentitySecurableElements",
      matches: {
        entity: "domainEntity",
        namespace: "EdFi",
        entityName: [
          "ProgramEvaluation",
          "ProgramEvaluationElement",
          "ProgramEvaluationObjective",
          "EvaluationRubricDimension",
        ],
      },
      data: {
        versionRange: v5_0,
        roleName: "Program",
        description: "Discovers all identity properties with Program role that reference education organizations",
      },
    },
  ] + (
    // Conditionally add experimental features
    if enableExperimentalFeatures then [
      {
        rule: "experimentalRule",
        matches: {
          entity: "domainEntity",
          namespace: "EdFi",
          entityName: "ExperimentalEntity",
        },
        data: {
          enabled: true,
          description: "Experimental feature configuration",
        },
      },
    ] else []
  ),
}