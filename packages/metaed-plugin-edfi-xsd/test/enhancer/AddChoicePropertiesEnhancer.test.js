// @flow
import { newMetaEdEnvironment, newAssociation, newChoice, newCommon, newCommonProperty, newChoiceProperty, newDescriptor, newDomainEntity } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Association, Choice, Common, Descriptor, DomainEntity } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/AddChoicePropertiesEnhancer';

describe('when enhancing association with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName: string = 'ChoiceName';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.association.set(association.metaEdName, association);

    association.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    }));

    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add choice properties to association', () => {
    const association: any = metaEd.entity.association.get(entityName);
    expect(association.properties.length).toBe(1);
    const choiceProperty: any = association.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing association with choices nested', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1: string = 'ChoiceName1';
  const choiceName2: string = 'ChoiceName2';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.association.set(association.metaEdName, association);

    association.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    }));

    const choice1: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    }));

    const choice2: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add two levels of choice properties to association', () => {
    const association: any = metaEd.entity.association.get(entityName);
    expect(association.properties.length).toBe(1);

    const choiceProperty1: any = association.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsd_Properties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsd_Properties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing common with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName: string = 'ChoiceName';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.common.set(common.metaEdName, common);

    common.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    }));

    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add choice properties to common', () => {
    const common: any = metaEd.entity.common.get(entityName);
    expect(common.properties.length).toBe(1);
    const choiceProperty: any = common.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing common with choices nested', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1: string = 'ChoiceName1';
  const choiceName2: string = 'ChoiceName2';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const common: Common = Object.assign(newCommon(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.common.set(common.metaEdName, common);

    common.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    }));

    const choice1: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    }));

    const choice2: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add two levels of choice properties to common', () => {
    const common: any = metaEd.entity.common.get(entityName);
    expect(common.properties.length).toBe(1);

    const choiceProperty1: any = common.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsd_Properties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsd_Properties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing descriptor with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName: string = 'ChoiceName';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    descriptor.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    }));

    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add choice properties to descriptor', () => {
    const descriptor: any = metaEd.entity.descriptor.get(entityName);
    expect(descriptor.properties.length).toBe(1);
    const choiceProperty: any = descriptor.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing descriptor with choices nested', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1: string = 'ChoiceName1';
  const choiceName2: string = 'ChoiceName2';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    descriptor.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    }));

    const choice1: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    }));

    const choice2: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add two levels of choice properties to descriptor', () => {
    const descriptor: any = metaEd.entity.descriptor.get(entityName);
    expect(descriptor.properties.length).toBe(1);

    const choiceProperty1: any = descriptor.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsd_Properties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsd_Properties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing domainEntity with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName: string = 'ChoiceName';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntity.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    }));

    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add choice properties to domainEntity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(entityName);
    expect(domainEntity.properties.length).toBe(1);
    const choiceProperty: any = domainEntity.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing domainEntity with choices nested', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1: string = 'ChoiceName1';
  const choiceName2: string = 'ChoiceName2';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      data: { edfiXsd: {} },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntity.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    }));

    const choice1: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName1,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push(Object.assign(newChoiceProperty(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    }));

    const choice2: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName2,
      data: { edfiXsd: {} },
    });
    metaEd.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push(Object.assign(newCommonProperty(), {
      metaEdName: propertyName,
      data: { edfiXsd: {} },
    }));
    enhance(metaEd);
  });

  it('should add two levels of choice properties to domainEntity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(entityName);
    expect(domainEntity.properties.length).toBe(1);

    const choiceProperty1: any = domainEntity.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsd_Properties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsd_Properties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsd_Properties[0].metaEdName).toBe(propertyName);
  });
});

