// @flow
import {
  newMetaEdEnvironment,
  newDomainEntity,
  newDomainEntitySubclass,
  newAssociation,
  newAssociationSubclass,
  newDescriptor,
  newInterchange,
  newInterchangeItem,
  newDomainEntityExtension,
  newInterchangeExtension,
  addEntity,
  getEntity,
} from '../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/InterchangeBaseItemEnhancer';

describe('when enhancing interchange in core', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const interchangeMetaEdName: string = 'InterchangeMetaEdName';

  const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity1' });
  const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity2' });
  const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), { metaEdName: 'DomainEntitySubclass1' });
  const domainEntitySubclass2 = Object.assign(newDomainEntitySubclass(), { metaEdName: 'DomainEntitySubclass2' });
  const association1 = Object.assign(newAssociation(), { metaEdName: 'Association1' });
  const association2 = Object.assign(newAssociation(), { metaEdName: 'Association2' });
  const associationSubclass1 = Object.assign(newAssociationSubclass(), { metaEdName: 'AssociationSubclass1' });
  const associationSubclass2 = Object.assign(newAssociationSubclass(), { metaEdName: 'AssociationSubclass2' });
  const descriptor1 = Object.assign(newDescriptor(), { metaEdName: 'Descriptor1' });
  const descriptor2 = Object.assign(newDescriptor(), { metaEdName: 'Descriptor2' });

  const elementEntities = [domainEntity1, domainEntitySubclass1, association1, associationSubclass1, descriptor1];
  const identityTemplateEntities = [domainEntity2, domainEntitySubclass2, association2, associationSubclass2, descriptor2];

  beforeAll(() => {
    const interchange = Object.assign(newInterchange(), { metaEdName: interchangeMetaEdName });
    addEntity(metaEd.entity, interchange);

    elementEntities.forEach(entity => {
      interchange.elements.push(Object.assign(newInterchangeItem(), {
        metaEdName: entity.metaEdName,
        referencedType: [entity.type],
      }));
      addEntity(metaEd.entity, entity);
    });

    identityTemplateEntities.forEach(entity => {
      interchange.identityTemplates.push(Object.assign(newInterchangeItem(), {
        metaEdName: entity.metaEdName,
        referencedType: [entity.type],
      }));
      addEntity(metaEd.entity, entity);
    });

    enhance(metaEd);
  });

  it('should have references for all entities', () => {
    const interchange: any = getEntity(metaEd.entity, interchangeMetaEdName, 'interchange');
    expect(interchange.elements[0].referencedEntity).toBe(domainEntity1);
    expect(interchange.elements[1].referencedEntity).toBe(domainEntitySubclass1);
    expect(interchange.elements[2].referencedEntity).toBe(association1);
    expect(interchange.elements[3].referencedEntity).toBe(associationSubclass1);
    expect(interchange.elements[4].referencedEntity).toBe(descriptor1);

    expect(interchange.identityTemplates[0].referencedEntity).toBe(domainEntity2);
    expect(interchange.identityTemplates[1].referencedEntity).toBe(domainEntitySubclass2);
    expect(interchange.identityTemplates[2].referencedEntity).toBe(association2);
    expect(interchange.identityTemplates[3].referencedEntity).toBe(associationSubclass2);
    expect(interchange.identityTemplates[4].referencedEntity).toBe(descriptor2);
  });
});

describe('when enhancing interchange extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const interchangeMetaEdName: string = 'InterchangeMetaEdName';

  const domainEntity = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity' });
  const domainEntityExtension = Object.assign(newDomainEntityExtension(), { metaEdName: 'DomainEntity' });

  beforeAll(() => {
    addEntity(metaEd.entity, domainEntity);
    addEntity(metaEd.entity, domainEntityExtension);

    const interchange = Object.assign(newInterchange(), { metaEdName: interchangeMetaEdName });
    addEntity(metaEd.entity, interchange);

    const interchangeExtension = Object.assign(newInterchangeExtension(), { metaEdName: interchangeMetaEdName });
    addEntity(metaEd.entity, interchangeExtension);

    interchange.elements.push(Object.assign(newInterchangeItem(), {
      metaEdName: domainEntity.metaEdName,
      referencedType: [domainEntity.type],
    }));

    interchangeExtension.elements.push(Object.assign(newInterchangeItem(), {
      metaEdName: domainEntityExtension.metaEdName,
      referencedType: [domainEntityExtension.type],
    }));

    enhance(metaEd);
  });

  it('should have references for all entities', () => {
    const interchange: any = getEntity(metaEd.entity, interchangeMetaEdName, 'interchange');
    expect(interchange.elements[0].referencedEntity).toBe(domainEntity);

    const interchangeExtension: any = getEntity(metaEd.entity, interchangeMetaEdName, 'interchangeExtension');
    expect(interchangeExtension.elements[0].referencedEntity).toBe(domainEntityExtension);
  });
});

