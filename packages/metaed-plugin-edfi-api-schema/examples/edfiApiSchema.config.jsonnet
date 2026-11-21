// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// API Schema security configuration for Data Standard 5.2.
// Supply INCLUDE_REPORTED_SCHOOL as "true" or "false" in externalVariables.

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

local includeReportedSchool = std.extVar("INCLUDE_REPORTED_SCHOOL") == "true";

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
    if includeReportedSchool then [
      makeSecurityRule(
        "StudentAssessment",
        "ReportedSchool",
        "SchoolId",
        "Maps ReportedSchool reference to SchoolId for security",
        v4_0
      ),
    ] else []
  ),
}
