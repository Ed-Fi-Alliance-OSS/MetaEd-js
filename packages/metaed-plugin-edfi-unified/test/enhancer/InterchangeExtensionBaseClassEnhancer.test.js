// @flow
import { newMetaEdEnvironment, newInterchange, newInterchangeExtension } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Interchange, InterchangeExtension } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/InterchangeExtensionBaseClassEnhancer';

describe('when enhancing interchange extension referring to interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: Interchange;
  let childEntity: InterchangeExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newInterchange(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.interchange.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newInterchangeExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.interchangeExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
