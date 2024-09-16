
# API Schema Documentation

The `ApiSchema.json` file represents the API schema for the Ed-Fi DMS. The file contains two main sections:

1. `projectSchemas`
2. `projectNameMapping`

## projectSchemas

This section is a collection of ProjectNamespaces mapped to ProjectSchema objects. It contains the detailed schema information for each project in the API.

### Structure:

```json
{
  "projectSchemas": {
    "[ProjectNamespace]": {
      // ProjectSchema object
    }
  }
}
```

## projectNameMapping

This section is a collection of MetaEdProjectNames mapped to ProjectNamespaces. It contains the mapping between the project names used in MetaEd and the actual project namespaces in the API.

### Structure:
```json
{
  "projectNameMapping": {
    "[MetaEdProjectName]": "[ProjectNamespace]"
  }
}
```

## ProjectSchema

Each project in the projectSchemas section of ApiSchema.json is represented by a ProjectSchema object with the following properties:

 - `projectName`: The MetaEd project name (e.g., "EdFi" for a data standard entity).
 - `projectVersion`: The version of the project, represented as a semantic version (SemVer).
 - `isExtensionProject`: A boolean indicating whether this is an extension project.
 - `description`: A string describing the project.
 - `resourceSchemas`: A collection of EndpointNames mapped to ResourceSchema objects.
 - `resourceNameMapping`: A collection of ResourceNames mapped to EndpointNames.
 - `caseInsensitiveEndpointNameMapping`: A collection of lowercased EndpointNames mapped to correct-cased EndpointNames, used for case-insensitive endpoint access.
 - `schoolYearEnumeration`: An optional ResourceSchema for the SchoolYearEnumeration (which is not a resource but has a ResourceSchema).
 - `abstractResources`: A collection of ResourceNames of abstract resources (that don't materialize to endpoints) mapped to AbstractResourceInfos.

 
### Structure:

```json
{
  "projectSchemas": {
    "[ProjectNamespace]": {
      "projectName": "EdFi",
      "projectVersion": "5.1.0",
      "isExtensionProject": false,
      "description": "Ed-Fi Core API",
      "resourceSchemas": {
        // EndpointNames mapped to ResourceSchema objects
      },
      "resourceNameMapping": {
        // ResourceNames mapped to EndpointNames
      },
      "caseInsensitiveEndpointNameMapping": {
        // Lowercased EndpointNames mapped to correct-cased EndpointNames
      },
      "schoolYearEnumeration": {
        // Optional ResourceSchema for SchoolYearEnumeration
      },
      "abstractResources": {
        // ResourceNames of abstract resources mapped to AbstractResourceInfos
      }
    }
  }
}
```


## ResourceSchemas

The `resourceSchemas` property in `ProjectSchema` is of type `ResourceSchemaMapping`, which is a collection of `EndpointNames` mapped to `ResourceSchema` objects. Each `ResourceSchema` object contains detailed information about a specific API resource.

A `ResourceSchema` can be one of three types:
- Base Resource Schema
- Association Subclass Resource Schema
- Domain Entity Subclass Resource Schema

All types share common properties from `BaseResourceSchema`, with additional properties for subclass types.

### Common Properties (BaseResourceSchema)
 - `resourceName`: The name of the resource (typically the entity metaEdName).
 - `isDescriptor`: Boolean indicating if the resource is a descriptor.
 - `isSchoolYearEnumeration`: Boolean indicating if the resource is a school year enumeration.
 - `allowIdentityUpdates`: Boolean indicating if API clients can modify the identity of an existing resource document.
 - `jsonSchemaForInsert`: The JSON Schema for this resource, used for validation when inserting a new resource document.
 - `equalityConstraints`: A list of EqualityConstraint objects (source/target JsonPath pairs), used for validating the equality of two document elements that must be the same.
 - `identityJsonPaths`: A list of JsonPaths that are part of the resource's identity.
 - `booleanJsonPaths`: A list of JsonPaths for boolean fields (used in type coercion).
 - `numericJsonPaths`: A list of JsonPaths for numeric fields (used in type coercion).
 - `documentPathsMapping`: A collection of MetaEd property fullnames mapped to DocumentPaths objects.
 - `queryFieldMapping`: A mapping of API query term strings to the JsonPaths in the document for querying, used for building search engine API query expressions.

### Additional Properties for Subclass Resources

For resources that are subclasses (`isSubclass: true`), there are additional properties that describe the subclass's relationship to its superclass.

#### Association Subclass:
 - `superclassProjectName`: The project name of the superclass.
 - `superclassResourceName`: The resource name of the superclass.

#### Domain Entity Subclass:
Includes all properties of Association Subclass, plus:
 - `superclassIdentityJsonPath`: The JsonPath for the superclass identity (used for identity renaming in Domain Entities).

Example:
```json
{
  "resourceSchemas": {
    "students": {
      "resourceName": "Student",
      "isDescriptor": false,
      "isSchoolYearEnumeration": false,
      "allowIdentityUpdates": false,
      "jsonSchemaForInsert": {
        // JSON schema object
      },
      "equalityConstraints": [
        // List of EqualityConstraint objects
      ],
      "identityJsonPaths": [
        // List of JsonPath strings
      ],
      "booleanJsonPaths": [
        // List of JsonPath strings
      ],
      "numericJsonPaths": [
        // List of JsonPath strings
      ],
      "documentPathsMapping": {
        // MetaEd property fullnames mapped to DocumentPaths objects
      },
      "queryFieldMapping": {
        // API query term strings mapped to JsonPaths
      },
      "isSubclass": false
    },
    // More resources...
  }
}
```

## DocumentPathsMappings

The `documentPathsMapping` property in `ResourceSchema` is a collection of MetaEd property fullnames mapped to `DocumentPaths` objects, which provide information on how to access different properties within a resource document, including both scalar values and references to other resources.

DocumentPaths can be one of three types:
- DocumentReferencePaths
- DescriptorReferencePath
- ScalarPath

### DocumentReferencePaths

Used for references to non-descriptor resources.

 - `projectName`: The MetaEd project name of the referenced resource.
 - `resourceName`: The name of the referenced API resource.
 - `referenceJsonPaths`: An array of ReferenceJsonPaths objects, each containing:
 - `referenceJsonPath`: The JsonPath to the reference in the current document.
 - `identityJsonPath`: The corresponding JsonPath in the referenced document.

### DescriptorReferencePath

Used for references to descriptor resources.

 - `projectName`: The MetaEd project name of the descriptor.
 - `resourceName`: The name of the descriptor resource.
 - `path`: The JsonPath to the descriptor value in the document.

### ScalarPath

Used for scalar (non-reference) properties.

 - `path`: The JsonPath to the scalar value in the document.

### DocumentPathsMappings Example
Here's an example of what a `documentPathsMapping` might look like for a `Student` resource. Here `studentUniqueId`, `firstName`, `lastSurname`, and `birthDate` are scalar properties, `schoolReference` is a reference property to a `School` resource, and `sexDescriptor` is a descriptor reference property to a `SexDescriptor` resource.

```json
{
  "studentUniqueId": {
    "isReference": false,
    "path": "$.studentUniqueId"
  },
  "firstName": {
    "isReference": false,
    "path": "$.firstName"
  },
  "lastSurname": {
    "isReference": false,
    "path": "$.lastSurname"
  },
  "birthDate": {
    "isReference": false,
    "path": "$.birthDate"
  },
  "schoolReference": {
    "isReference": true,
    "projectName": "EdFi",
    "resourceName": "School",
    "isDescriptor": false,
    "referenceJsonPaths": [
      {
        "referenceJsonPath": "$.schoolReference.schoolId",
        "identityJsonPath": "$.schoolId"
      }
    ]
  },
  "sexDescriptor": {
    "isReference": true,
    "projectName": "EdFi",
    "resourceName": "SexDescriptor",
    "isDescriptor": true,
    "path": "$.sexDescriptor"
  }
}
```
