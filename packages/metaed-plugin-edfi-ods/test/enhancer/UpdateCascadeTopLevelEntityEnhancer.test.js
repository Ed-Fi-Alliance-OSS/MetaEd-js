// @flow
import {
  addEntity,
  newAssociation,
  newAssociationProperty,
  newDomainEntity,
  newDomainEntityProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
} from 'metaed-core';
import type {
  Association,
  AssociationProperty,
  DomainEntity,
  DomainEntityProperty,
  IntegerProperty,
  MetaEdEnvironment,
} from 'metaed-core';
import { enhance } from '../../src/enhancer/UpdateCascadeTopLevelEntityEnhancer';

describe('when UpdateCascadeTopLevelEntityEnhancer enhances domain entity with allow primary key updates', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity1Property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      parentEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity1.data.edfiOds.ods_Properties.push(domainEntity1Property);
    domainEntity1.data.edfiOds.ods_IdentityProperties.push(domainEntity1Property);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      allowPrimaryKeyUpdates: true,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity2Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity2.data.edfiOds.ods_Properties.push(domainEntity2Property);
    domainEntity2.data.edfiOds.ods_IdentityProperties.push(domainEntity2Property);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity3Property1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property1);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property1);
    const domainEntity3Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property2);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property2);
    addEntity(metaEd.entity, domainEntity3);

    enhance(metaEd);
  });

  it('should not have cascade primary key updates for first domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });

  it('should have cascade primary key updates for second domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for third domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName3);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });
});

describe('when UpdateCascadeTopLevelEntityEnhancer enhances associations with allow primary key updates', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  const associationName: string = 'AssociationName';

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity1Property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      parentEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity1.data.edfiOds.ods_Properties.push(domainEntity1Property);
    domainEntity1.data.edfiOds.ods_IdentityProperties.push(domainEntity1Property);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity2Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity2.data.edfiOds.ods_Properties.push(domainEntity2Property);
    domainEntity2.data.edfiOds.ods_IdentityProperties.push(domainEntity2Property);
    addEntity(metaEd.entity, domainEntity2);

    const association: Association = Object.assign(newAssociation(), {
      metaEdName: associationName,
      allowPrimaryKeyUpdates: true,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const associationProperty1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: association,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationProperty1);
    association.data.edfiOds.ods_IdentityProperties.push(associationProperty1);
    const associationProperty2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntity: association,
      referencedEntity: domainEntity2,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationProperty2);
    association.data.edfiOds.ods_IdentityProperties.push(associationProperty2);
    addEntity(metaEd.entity, association);

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity3Property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property);
    addEntity(metaEd.entity, domainEntity3);
    enhance(metaEd);
  });

  it('should not have cascade primary key updates for first domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });

  it('should not have cascade primary key updates for second domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });

  it('should have cascade primary key updates for association', () => {
    const association: any = metaEd.entity.association.get(associationName);
    expect(association.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for third domain entity', () => {
    const association: any = metaEd.entity.association.get(associationName);
    expect(association.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });
});

describe('when UpdateCascadeTopLevelEntityEnhancer enhances domain entity with allow primary key updates on deep reference graph', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  const domainEntityName4: string = 'DomainEntityName4';

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      allowPrimaryKeyUpdates: true,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity1Property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      parentEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity1.data.edfiOds.ods_Properties.push(domainEntity1Property);
    domainEntity1.data.edfiOds.ods_IdentityProperties.push(domainEntity1Property);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity2Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity2.data.edfiOds.ods_Properties.push(domainEntity2Property);
    domainEntity2.data.edfiOds.ods_IdentityProperties.push(domainEntity2Property);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity3Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property);
    addEntity(metaEd.entity, domainEntity3);

    const domainEntity4: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName4,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity4Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity3,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity4.data.edfiOds.ods_Properties.push(domainEntity4Property);
    domainEntity4.data.edfiOds.ods_IdentityProperties.push(domainEntity4Property);
    addEntity(metaEd.entity, domainEntity4);

    enhance(metaEd);
  });

  it('should have cascade primary key updates for first domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for second domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for third domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName3);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for forth domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName4);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });
});

describe('when UpdateCascadeTopLevelEntityEnhancer enhances domain entity with allow primary key updates on cyclical reference graph', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  const domainEntityName4: string = 'DomainEntityName4';

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      allowPrimaryKeyUpdates: true,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName1,
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity1Property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      parentEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity1.data.edfiOds.ods_Properties.push(domainEntity1Property);
    domainEntity1.data.edfiOds.ods_IdentityProperties.push(domainEntity1Property);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName2,
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity2Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity2.data.edfiOds.ods_Properties.push(domainEntity2Property);
    domainEntity2.data.edfiOds.ods_IdentityProperties.push(domainEntity2Property);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName3,
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity3Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property);
    addEntity(metaEd.entity, domainEntity3);

    const domainEntity4: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName4,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName4,
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity4Property1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity2,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_CausesCyclicUpdateCascade: false,
        },
      },
    });
    domainEntity4.data.edfiOds.ods_Properties.push(domainEntity4Property1);
    domainEntity4.data.edfiOds.ods_IdentityProperties.push(domainEntity4Property1);
    const domainEntity4Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity3,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity4.data.edfiOds.ods_Properties.push(domainEntity4Property2);
    domainEntity4.data.edfiOds.ods_IdentityProperties.push(domainEntity4Property2);
    addEntity(metaEd.entity, domainEntity4);

    enhance(metaEd);
  });

  it('should have cascade primary key updates for first domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for second domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for third domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName3);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for forth domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName4);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have only one cascading property on forth domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName4);
    expect(domainEntity.data.edfiOds.ods_Properties[0].data.edfiOds.ods_CausesCyclicUpdateCascade).toBe(false);
    expect(domainEntity.data.edfiOds.ods_Properties[1].data.edfiOds.ods_CausesCyclicUpdateCascade).toBe(true);
  });
});

describe('when UpdateCascadeTopLevelEntityEnhancer enhances domain entity with allow primary key updates on non primary key reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      allowPrimaryKeyUpdates: true,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity1Property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      parentEntity: domainEntity1,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity1.data.edfiOds.ods_Properties.push(domainEntity1Property);
    domainEntity1.data.edfiOds.ods_IdentityProperties.push(domainEntity1Property);
    addEntity(metaEd.entity, domainEntity1);

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity2Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName1,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity1,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity2.data.edfiOds.ods_Properties.push(domainEntity2Property);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const domainEntity3Property: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
        },
      },
    });
    domainEntity3.data.edfiOds.ods_Properties.push(domainEntity3Property);
    domainEntity3.data.edfiOds.ods_IdentityProperties.push(domainEntity3Property);
    addEntity(metaEd.entity, domainEntity3);

    enhance(metaEd);
  });

  it('should not have cascade primary key updates for first domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(true);
  });

  it('should have cascade primary key updates for second domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });

  it('should have cascade primary key updates for third domain entity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName3);
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });
});
