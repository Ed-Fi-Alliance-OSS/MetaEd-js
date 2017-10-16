// @flow
import { newMetaEdEnvironment, newCommon, newCommonExtension } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Common, CommonExtension } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/CommonExtensionBaseClassEnhancer';

describe('when enhancing common extension referring to common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  let parentEntity: Common;
  let childEntity: CommonExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newCommon(), {
      metaEdName: parentEntityName,
    });
    metaEd.entity.common.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newCommonExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
    });
    metaEd.entity.commonExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
