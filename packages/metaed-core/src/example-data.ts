export const repository = {
  unified: {
    core: {
      domainEntity: {
        School: {
          metaEdName: 'School',
          property: {
            Name: {
              type: 'StringProperty',
              metaEdName: 'Name',
              maxLength: 123,
              roleName: '',
            },
            EducationOrganization: {
              type: 'domainEntityProperty',
              metaEdName: 'EducationOrganization',
              reference: 'core/domainEntity/EducationOrganization',
              roleName: '',
            },
            AlternateEducationOrganization: {
              type: 'domainEntityProperty',
              metaEdName: 'EducationOrganization',
              roleName: 'Alternate',
              reference: 'core/domainEntity/EducationOrganization',
            },
          },
        },
        EducationOrganization: {
          metaEdName: 'EducationOrganization',
          property: {
            Name: {
              type: 'StringProperty',
              metaEdName: 'Name',
            },
          },
        },
      },
    },
    extension: {},
  },
  plugin: {
    EdFiOdsSqlServer: {
      table: {
        name: 'School',
        column: {
          name: 'Name',
          type: 'VARCHAR(50)',
          isPrimaryKey: false,
          sourceProperties: [{ ref: 'core/domainEntity/blah' }, { ref: 'core/domainEntity/blah2' }],
        },
        foreignKey: [{ localColumn: 'Name', parentColumnRef: 'Student/column/' }],
      },
    },
    EdFiXsd: {},
    EdFiHandbook: {},
  },
};
