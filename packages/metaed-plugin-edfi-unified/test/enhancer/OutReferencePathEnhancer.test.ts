import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  CommonBuilder,
  DescriptorBuilder,
  MetaEdEnvironment,
  SharedStringBuilder,
  DomainEntitySubclassBuilder,
} from '@edfi/metaed-core';
import { enhance as outReferencePathEnhancer } from '../../src/enhancer/OutReferencePathEnhancer';
import { enhance as domainEntityReferenceEnhancer } from '../../src/enhancer/property/DomainEntityReferenceEnhancer';
import { enhance as stringReferenceEnhancer } from '../../src/enhancer/property/StringReferenceEnhancer';
import { enhance as commonReferenceEnhancer } from '../../src/enhancer/property/CommonReferenceEnhancer';
import { enhance as descriptorReferenceEnhancer } from '../../src/enhancer/property/DescriptorReferenceEnhancer';

describe('when domain entity has single reference to a second domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have DE1 with out path to DE2', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
  });

  it('should have DE1 with map of out path containing DE2', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(1);
    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE2');

    const outReferencePaths: any = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
  });

  it('should have DE1 with map of endpoint containing DE2', (): void => {
    const { outReferenceEntityEndpointsMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntityEndpointsMap.size).toBe(1);
    const outReferenceKV: any = Array.from(outReferenceEntityEndpointsMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE2');

    const outReferencePaths: any = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
  });

  it('should have DE2 with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE2').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has single reference to a second domain entity with reference to a third', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have DE1 with out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of out path containing DE2', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(2);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE2');
    const outReferencePaths: any = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of out path containing DE3', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(2);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[1];
    expect(outReferenceKV[0].metaEdName).toBe('DE3');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of endpoint containing DE3', (): void => {
    const { outReferenceEntityEndpointsMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntityEndpointsMap.size).toBe(1);

    const outReferenceKV: any = Array.from(outReferenceEntityEndpointsMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE3');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE2 with out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
  });

  it('should have DE3 with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE3').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has dual references to domain entities with reference to another', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2a', 'doc', true, false)
      .withDomainEntityProperty('DE2b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3a', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3a')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3b')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build five domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(5);
  });

  it('should have DE1 with out path to DE3a', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(2);
    const outReferencePathA = outReferencePaths[0];
    expect(outReferencePathA).toHaveLength(2);
    expect(outReferencePathA[0].metaEdName).toBe('DE2a');
    expect(outReferencePathA[1].metaEdName).toBe('DE3a');
  });

  it('should have DE1 with out path to DE3b', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(2);
    const outReferencePathB = outReferencePaths[1];
    expect(outReferencePathB).toHaveLength(2);
    expect(outReferencePathB[0].metaEdName).toBe('DE2b');
    expect(outReferencePathB[1].metaEdName).toBe('DE3b');
  });

  it('should have DE1 with map of out path containing DE2a', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(4);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE2a');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2a');
    expect(outReferencePath[1].metaEdName).toBe('DE3a');
  });

  it('should have DE1 with map of out path containing DE3a', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(4);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[1];
    expect(outReferenceKV[0].metaEdName).toBe('DE3a');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2a');
    expect(outReferencePath[1].metaEdName).toBe('DE3a');
  });

  it('should have DE1 with map of endpoint containing DE3a', (): void => {
    const { outReferenceEntityEndpointsMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntityEndpointsMap.size).toBe(2);

    const outReferenceKV: any = Array.from(outReferenceEntityEndpointsMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE3a');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2a');
    expect(outReferencePath[1].metaEdName).toBe('DE3a');
  });

  it('should have DE1 with map of out path containing DE2b', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(4);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[2];
    expect(outReferenceKV[0].metaEdName).toBe('DE2b');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2b');
    expect(outReferencePath[1].metaEdName).toBe('DE3b');
  });

  it('should have DE1 with map of out path containing DE3b', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(4);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[3];
    expect(outReferenceKV[0].metaEdName).toBe('DE3b');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2b');
    expect(outReferencePath[1].metaEdName).toBe('DE3b');
  });

  it('should have DE1 with map of endpoint containing DE3b', (): void => {
    const { outReferenceEntityEndpointsMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntityEndpointsMap.size).toBe(2);

    const outReferenceKV: any = Array.from(outReferenceEntityEndpointsMap)[1];
    expect(outReferenceKV[0].metaEdName).toBe('DE3b');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2b');
    expect(outReferencePath[1].metaEdName).toBe('DE3b');
  });

  it('should have DE2a with out path to DE3a', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2a');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3a');
  });

  it('should have DE2b with out path to DE3b', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2b');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3b');
  });

  it('should have DE3a with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE3a').outReferencePaths).toHaveLength(0);
  });

  it('should have DE3b with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE3b').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has dual references to domain entities with reference to another that is the same (diamond)', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2a', 'doc', true, false)
      .withDomainEntityProperty('DE2b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have DE1 with 1st out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(2);
    const outReferencePathA = outReferencePaths[0];
    expect(outReferencePathA).toHaveLength(2);
    expect(outReferencePathA[0].metaEdName).toBe('DE2a');
    expect(outReferencePathA[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with 2nd out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(2);
    const outReferencePathB = outReferencePaths[1];
    expect(outReferencePathB).toHaveLength(2);
    expect(outReferencePathB[0].metaEdName).toBe('DE2b');
    expect(outReferencePathB[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of out path containing DE2a', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(3);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE2a');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2a');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of out path containing DE3', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(3);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[1];
    expect(outReferenceKV[0].metaEdName).toBe('DE3');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(2);

    const outReferencePathA = outReferencePaths[0];
    expect(outReferencePathA).toHaveLength(2);
    expect(outReferencePathA[0].metaEdName).toBe('DE2a');
    expect(outReferencePathA[1].metaEdName).toBe('DE3');

    const outReferencePathB = outReferencePaths[1];
    expect(outReferencePathB).toHaveLength(2);
    expect(outReferencePathB[0].metaEdName).toBe('DE2b');
    expect(outReferencePathB[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of endpoint containing DE3', (): void => {
    const { outReferenceEntityEndpointsMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntityEndpointsMap.size).toBe(1);

    const outReferenceKV: any = Array.from(outReferenceEntityEndpointsMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('DE3');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(2);

    const outReferencePathA = outReferencePaths[0];
    expect(outReferencePathA).toHaveLength(2);
    expect(outReferencePathA[0].metaEdName).toBe('DE2a');
    expect(outReferencePathA[1].metaEdName).toBe('DE3');

    const outReferencePathB = outReferencePaths[1];
    expect(outReferencePathB).toHaveLength(2);
    expect(outReferencePathB[0].metaEdName).toBe('DE2b');
    expect(outReferencePathB[1].metaEdName).toBe('DE3');
  });

  it('should have DE1 with map of out path containing DE2b', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferenceEntitiesMap.size).toBe(3);

    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[2];
    expect(outReferenceKV[0].metaEdName).toBe('DE2b');
    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE2b');
    expect(outReferencePath[1].metaEdName).toBe('DE3');
  });

  it('should have DE2a with out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2a');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
  });

  it('should have DE2b with out path to DE3', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2b');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
  });

  it('should have DE3 with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE3').outReferencePaths).toHaveLength(0);
  });
});

describe('when model has a leaf attached to a cycle', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('Leaf', 'doc', true, false)
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Leaf')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have DE1 with out path direct to Leaf', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('Leaf');
  });

  it('should have DE2 with out path to Leaf via DE3 -> DE1', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE2');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(3);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
    expect(outReferencePath[1].metaEdName).toBe('DE1');
    expect(outReferencePath[2].metaEdName).toBe('Leaf');
  });

  it('should have DE3 with out path to Leaf via DE1', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE3');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('DE1');
    expect(outReferencePath[1].metaEdName).toBe('Leaf');
  });

  it('should have Leaf with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('Leaf').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has single reference to a shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE')
      .withDocumentation('doc')
      .withSharedStringProperty('SS', null, 'doc', true, false)
      .withEndDomainEntity()

      .withStartSharedString('SS')
      .withDocumentation('doc')
      .withStringRestrictions('0', '100')
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    stringReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared string', (): void => {
    expect(coreNamespace.entity.sharedString.size).toBe(1);
  });

  it('should have DE with out path to SS', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('SS');
  });

  it('should have DE with map of out path containing SS', (): void => {
    const { outReferenceEntitiesMap } = coreNamespace.entity.domainEntity.get('DE');
    expect(outReferenceEntitiesMap.size).toBe(1);
    const outReferenceKV: any = Array.from(outReferenceEntitiesMap)[0];
    expect(outReferenceKV[0].metaEdName).toBe('SS');

    const outReferencePaths = outReferenceKV[1];
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('SS');
  });
});

describe('when domain entity has single reference to a common with reference to a descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE')
      .withDocumentation('doc')
      .withCommonProperty('CO', 'doc', true, false)
      .withEndDomainEntity()

      .withStartCommon('CO')
      .withDocumentation('doc')
      .withDescriptorProperty('DS', 'doc', true, false)
      .withEndCommon()

      .withStartDescriptor('DS')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one descriptor', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should have DE with out path to DS', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(2);
    expect(outReferencePath[0].metaEdName).toBe('CO');
    expect(outReferencePath[1].metaEdName).toBe('DS');
  });

  it('should have CO with out path to DS', (): void => {
    const { outReferencePaths } = coreNamespace.entity.common.get('CO');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DS');
  });

  it('should have DS with no out paths', (): void => {
    expect(coreNamespace.entity.descriptor.get('DS').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has a reference and domain entity subclass has another', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')

      .withStartDomainEntitySubclass('DES', 'DE')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(extensionNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have DE1 with out path to DE2', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
  });

  it('should have DES with out path to DE3', (): void => {
    const { outReferencePaths } = extensionNamespace.entity.domainEntitySubclass.get('DES');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
  });

  it('should have DE2 with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE2').outReferencePaths).toHaveLength(0);
  });

  it('should have DE3 with no out paths', (): void => {
    expect(extensionNamespace.entity.domainEntity.get('DE3').outReferencePaths).toHaveLength(0);
  });
});

describe('when domain entity has a reference and domain entity subclass has another', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')

      .withStartDomainEntitySubclass('DES', 'DE')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(extensionNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have DE1 with out path to DE2', (): void => {
    const { outReferencePaths } = coreNamespace.entity.domainEntity.get('DE1');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE2');
  });

  it('should have DES with out path to DE3', (): void => {
    const { outReferencePaths } = extensionNamespace.entity.domainEntitySubclass.get('DES');
    expect(outReferencePaths).toHaveLength(1);
    const outReferencePath = outReferencePaths[0];
    expect(outReferencePath).toHaveLength(1);
    expect(outReferencePath[0].metaEdName).toBe('DE3');
  });

  it('should have DE2 with no out paths', (): void => {
    expect(coreNamespace.entity.domainEntity.get('DE2').outReferencePaths).toHaveLength(0);
  });

  it('should have DE3 with no out paths', (): void => {
    expect(extensionNamespace.entity.domainEntity.get('DE3').outReferencePaths).toHaveLength(0);
  });
});
