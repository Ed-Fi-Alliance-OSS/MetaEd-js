// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { Namespace } from '@edfi/metaed-core';
import type { NamespaceEdfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/Namespace';
import type { ResourceSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/api-schema/ResourceSchema';
import type { ProjectSchema } from '@edfi/metaed-plugin-edfi-api-schema/src/model/api-schema/ProjectSchema';
import type { SchemaObject } from '@edfi/metaed-plugin-edfi-api-schema/src/model/OpenApiTypes';
import * as OpenApiTypes from '@edfi/metaed-plugin-edfi-api-schema/src/model/OpenApiTypes';
import { extractPropertyRowsForNamespace, extractResourceRowsForNamespace } from '../../src/generator/ApiCatalogGenerator';

/**
 * Helper to create a Namespace object from an OpenAPI fixture
 */
function createNamespaceWithFixture(fixture: any): Namespace {
  return {
    data: {
      edfiApiSchema: {
        apiSchema: {
          projectSchema: {
            projectEndpointName: 'ed-fi',
            projectVersion: '5.2.0',
            resourceSchemas: {
              testResource: {
                openApiFragments: {
                  resources: fixture,
                },
              } as unknown as ResourceSchema,
            },
          } as unknown as ProjectSchema,
        },
      } as NamespaceEdfiApiSchema,
    },
  } as Namespace;
}

describe('ApiCatalogGenerator', () => {
  describe('extractPropertyRowsForNamespace', () => {
    it('should return empty array when namespace has no edfiApiSchema data', () => {
      const namespace: Namespace = {
        data: {},
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toEqual([]);
    });

    it('should return empty array when apiSchema is null', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: null,
          },
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toEqual([]);
    });

    it('should extract properties from a simple resource', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'The unique identifier',
                                },
                                studentUniqueId: {
                                  type: 'string',
                                  description: 'A unique alphanumeric code',
                                  minLength: 1,
                                  maxLength: 32,
                                  pattern: '^(?!\\s).*(?<!\\s)$',
                                  'x-Ed-Fi-isIdentity': true,
                                },
                                firstName: {
                                  type: 'string',
                                  description: 'A name given to an individual',
                                  maxLength: 75,
                                  'x-nullable': true,
                                },
                              },
                              required: ['studentUniqueId'],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(2);
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "dataType": "string",
            "description": "A unique alphanumeric code",
            "isIdentityKey": true,
            "isNullable": false,
            "isRequired": true,
            "maxLength": 32,
            "minLength": 1,
            "project": "ed-fi",
            "propertyName": "studentUniqueId",
            "resourceName": "students",
            "validationRegEx": "^(?!\\\\s).*(?<!\\\\s)$",
            "version": "5.2.0",
          },
          Object {
            "dataType": "string",
            "description": "A name given to an individual",
            "isIdentityKey": false,
            "isNullable": true,
            "isRequired": false,
            "maxLength": 75,
            "minLength": null,
            "project": "ed-fi",
            "propertyName": "firstName",
            "resourceName": "students",
            "validationRegEx": null,
            "version": "5.2.0",
          },
        ]
      `);
    });

    it('should skip id property', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Should be skipped',
                                },
                                studentUniqueId: {
                                  type: 'string',
                                  description: 'Should be included',
                                },
                              },
                              required: [],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].propertyName).toBe('studentUniqueId');
    });

    it('should handle reference properties', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  studentSchoolAssociations: {
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_StudentSchoolAssociation: {
                              properties: {
                                studentReference: {
                                  $ref: '#/components/schemas/EdFi_Student_Reference',
                                  'x-Ed-Fi-isIdentity': true,
                                },
                              },
                              required: ['studentReference'],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        Object {
          "dataType": "reference",
          "description": "#/components/schemas/EdFi_Student_Reference",
          "isIdentityKey": true,
          "isNullable": false,
          "isRequired": true,
          "maxLength": null,
          "minLength": null,
          "project": "ed-fi",
          "propertyName": "studentReference",
          "resourceName": "studentSchoolAssociations",
          "validationRegEx": null,
          "version": "5.2.0",
        }
      `);
    });

    it('should handle array properties with $ref items', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              properties: {
                                addresses: {
                                  type: 'array',
                                  description: 'An unordered collection of studentAddresses',
                                  items: {
                                    $ref: '#/components/schemas/EdFi_Student_Address',
                                  },
                                },
                              },
                              required: [],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        Object {
          "dataType": "array",
          "description": "#/components/schemas/EdFi_Student_Address",
          "isIdentityKey": false,
          "isNullable": false,
          "isRequired": false,
          "maxLength": null,
          "minLength": null,
          "project": "ed-fi",
          "propertyName": "addresses",
          "resourceName": "students",
          "validationRegEx": null,
          "version": "5.2.0",
        }
      `);
    });

    it('should use format as dataType when present', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              properties: {
                                birthDate: {
                                  type: 'string',
                                  format: 'date',
                                  description: 'The month, day, and year on which an individual was born',
                                },
                              },
                              required: [],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].dataType).toBe('date');
      expect(result[0].description).toBe('The month, day, and year on which an individual was born');
    });

    it('should fall back to descriptors fragment when resources is not available', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  gradeTypeDescriptors: {
                    openApiFragments: {
                      descriptors: {
                        components: {
                          schemas: {
                            EdFi_GradeTypeDescriptor: {
                              properties: {
                                codeValue: {
                                  type: 'string',
                                  description: 'The descriptor code value',
                                  'x-Ed-Fi-isIdentity': true,
                                },
                              },
                              required: ['codeValue'],
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractPropertyRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].propertyName).toBe('codeValue');
      expect(result[0].resourceName).toBe('gradeTypeDescriptors');
    });

    describe('extractPropertyRowsForNamespace - scalar common ($ref) handling', () => {
      it('should handle scalar common (direct $ref to internal sub-schema)', () => {
        const fixture: any = {
          components: {
            schemas: {
              EdFi_Contact: {
                properties: {
                  contactUniqueId: { type: 'string' },
                  homeAddress: { $ref: '#/components/schemas/EdFi_Contact_HomeAddress' },
                },
                required: ['contactUniqueId'],
              } as SchemaObject,
              EdFi_Contact_HomeAddress: {
                properties: {
                  streetNumberName: { type: 'string' },
                  city: { type: 'string' },
                },
                required: [],
              } as SchemaObject,
            },
          },
        };

        const namespace = createNamespaceWithFixture(fixture);
        const rows = extractPropertyRowsForNamespace(namespace);

        // Should have rows for:
        // 1. contactUniqueId (root property)
        // 2. homeAddress (the $ref itself, as reference type)
        // 3. homeAddress.streetNumberName
        // 4. homeAddress.city
        expect(rows).toHaveLength(4);

        const homeAddressRow = rows.find(r => r.propertyName === 'homeAddress' && r.dataType === 'reference');
        expect(homeAddressRow).toBeDefined();
        expect(homeAddressRow?.description).toBe('#/components/schemas/EdFi_Contact_HomeAddress');

        const streetRow = rows.find(r => r.propertyName === 'homeAddress.streetNumberName');
        expect(streetRow).toBeDefined();
        expect(streetRow?.dataType).toBe('string');
      });
    });

    describe('extractPropertyRowsForNamespace - array branch handling', () => {
      it('should handle single common collection with no role name', () => {
        const fixture: Partial<OpenApiTypes.Document> = {
          components: {
            schemas: {
              EdFi_Contact: {
                properties: {
                  id: { type: 'string' },
                  contactUniqueId: { type: 'string' },
                  addresses: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/EdFi_Contact_Address' },
                  },
                },
                required: ['contactUniqueId', 'addresses'],
              } as SchemaObject,
              EdFi_Contact_Address: {
                properties: {
                  city: { type: 'string' },
                  state: { type: 'string' },
                },
                required: ['city'],
              } as SchemaObject,
            },
          },
        };

        const namespace = createNamespaceWithFixture(fixture);
        const rows = extractPropertyRowsForNamespace(namespace);

        // Should have rows for:
        // 1. contactUniqueId (scalar property)
        // 2. addresses (array property itself)
        // 3. address.city
        // 4. address.state
        expect(rows).toHaveLength(4);

        const addressesArrayRow = rows.find(r => r.propertyName === 'addresses' && r.dataType === 'array');
        expect(addressesArrayRow).toBeDefined();
        expect(addressesArrayRow?.isRequired).toBe(true);

        const cityRow = rows.find(r => r.propertyName === 'address.city');
        expect(cityRow).toBeDefined();
        expect(cityRow?.dataType).toBe('string');
      });
    });
  });

  describe('extractResourceRowsForNamespace', () => {
    it('should return empty array when namespace has no edfiApiSchema data', () => {
      const namespace: Namespace = {
        data: {},
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toEqual([]);
    });

    it('should return empty array when apiSchema is null', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: null,
          },
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toEqual([]);
    });

    it('should extract resource information from main schema', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: ['Student', 'Enrollment'],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              description: 'This entity represents an individual for whom instruction',
                              properties: {
                                studentUniqueId: {
                                  type: 'string',
                                },
                              },
                            },
                            EdFi_Student_Reference: {
                              description: 'Reference to Student',
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        Object {
          "domains": "Student, Enrollment",
          "project": "ed-fi",
          "resourceDescription": "This entity represents an individual for whom instruction",
          "resourceName": "students",
          "version": "5.2.0",
        }
      `);
    });

    it('should skip schemas with _Reference suffix when finding main schema', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: ['Student'],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student_Reference: {
                              description: 'Reference - should be skipped',
                            },
                            EdFi_Student: {
                              description: 'Main schema - should be used',
                              properties: {
                                studentUniqueId: {
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].resourceDescription).toBe('Main schema - should be used');
    });

    it('should skip schemas with _Readable and _Writable suffixes', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: [],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student_Readable: {
                              description: 'Readable - should be skipped',
                            },
                            EdFi_Student_Writable: {
                              description: 'Writable - should be skipped',
                            },
                            EdFi_Student: {
                              description: 'Main schema',
                              properties: {
                                studentUniqueId: {
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].resourceDescription).toBe('Main schema');
    });

    it('should use first schema when no main schema is found', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  gradeTypeDescriptors: {
                    domains: ['Grades'],
                    openApiFragments: {
                      descriptors: {
                        components: {
                          schemas: {
                            EdFi_GradeTypeDescriptor: {
                              description: 'A descriptor for grade types',
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].resourceDescription).toBe('A descriptor for grade types');
    });

    it('should handle empty domains array', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: [],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              description: 'Student resource',
                              properties: {},
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].domains).toBe('');
    });

    it('should format multiple domains as comma-separated list', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: ['Student', 'Enrollment', 'Attendance'],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              description: 'Student resource',
                              properties: {},
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].domains).toBe('Student, Enrollment, Attendance');
    });

    it('should handle missing description in schema', () => {
      const namespace: Namespace = {
        data: {
          edfiApiSchema: {
            apiSchema: {
              projectSchema: {
                projectEndpointName: 'ed-fi',
                projectVersion: '5.2.0',
                resourceSchemas: {
                  students: {
                    domains: [],
                    openApiFragments: {
                      resources: {
                        components: {
                          schemas: {
                            EdFi_Student: {
                              properties: {},
                            },
                          },
                        },
                      },
                    },
                  } as unknown as ResourceSchema,
                },
              } as unknown as ProjectSchema,
            },
          } as NamespaceEdfiApiSchema,
        },
      } as Namespace;

      const result = extractResourceRowsForNamespace(namespace);

      expect(result).toHaveLength(1);
      expect(result[0].resourceDescription).toBe('');
    });
  });
});
