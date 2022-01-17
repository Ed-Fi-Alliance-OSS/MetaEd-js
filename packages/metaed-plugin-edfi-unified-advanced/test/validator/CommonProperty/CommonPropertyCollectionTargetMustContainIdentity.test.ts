import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  MetaEdEnvironment,
  ValidationFailure,
  CommonSubclassBuilder,
} from '@edfi/metaed-core';
import { commonReferenceEnhancer, commonSubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyCollectionTargetMustContainIdentity';

describe('when validating collection common property target', (): void => {
  const COMMON_ENTITY_NAME = 'EntityName';
  const DOMAIN_ENTITY_NAME = 'EntityName2';
  const COMMON_SUB_ENTITY_NAME = 'CommonSubclass';

  describe('given the property does not have an identity', (): void => {
    describe('and given the property has no superclass', (): void => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      let failures: ValidationFailure[];
      let coreNamespace: any = null;

      beforeAll(() => {
        MetaEdTextBuilder.build()
          .withBeginNamespace('EdFi')
          .withStartCommon(COMMON_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          .withStringProperty('PropertyName1', 'PropertyDocumentation', true, false, '100')
          .withEndCommon()

          .withStartDomainEntity(DOMAIN_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          .withCommonProperty(COMMON_ENTITY_NAME, 'PropertyDocumentation', true, true)
          .withEndDomainEntity()
          .withEndNamespace()

          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new DomainEntityBuilder(metaEd, []))
          .sendToListener(new CommonBuilder(metaEd, []));

        coreNamespace = metaEd.namespace.get('EdFi');
        commonReferenceEnhancer(metaEd);

        failures = validate(metaEd);
      });

      it('should build one common', (): void => {
        expect(coreNamespace.entity.common.size).toBe(1);
      });

      it('should build one domain entity', (): void => {
        expect(coreNamespace.entity.domainEntity.size).toBe(1);
      });

      it('should have validation failure for property', (): void => {
        expect(failures[0].validatorName).toBe('CommonPropertyCollectionTargetMustContainIdentity');
        expect(failures[0].category).toBe('error');
        expect(failures[0].message).toMatchInlineSnapshot(
          `"Common property EntityName cannot be used as a collection because Common EntityName does not have any identity properties."`,
        );
        expect(failures[0].sourceMap).toMatchInlineSnapshot(`
          Object {
            "column": 11,
            "line": 13,
            "tokenText": "EntityName",
          }
        `);
      });
    });

    describe('and given the property has a superclass also without identity', (): void => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      let failures: ValidationFailure[];
      let coreNamespace: any = null;

      beforeAll(() => {
        MetaEdTextBuilder.build()
          .withBeginNamespace('EdFi')
          .withStartCommon(COMMON_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          // Does not have an identity
          .withStringProperty('PropertyName1', 'PropertyDocumentation', true, false, '100')
          .withEndCommon()

          .withStartCommonSubclass(COMMON_SUB_ENTITY_NAME, COMMON_ENTITY_NAME)
          // Does not have an identity
          .withStringProperty('PropertyName2', 'Property2Documentation', true, false, '100')
          .withEndCommonSubclass()

          .withStartDomainEntity(DOMAIN_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          .withCommonProperty(COMMON_SUB_ENTITY_NAME, 'PropertyDocumentation', true, true)
          .withEndDomainEntity()
          .withEndNamespace()

          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new DomainEntityBuilder(metaEd, []))
          .sendToListener(new CommonBuilder(metaEd, []))
          .sendToListener(new CommonSubclassBuilder(metaEd, []));

        coreNamespace = metaEd.namespace.get('EdFi');
        commonReferenceEnhancer(metaEd);
        commonSubclassBaseClassEnhancer(metaEd);

        failures = validate(metaEd);
      });

      it('should build one commons', (): void => {
        expect(coreNamespace.entity.common.size).toBe(1);
      });

      it('should build one domain entity', (): void => {
        expect(coreNamespace.entity.domainEntity.size).toBe(1);
      });

      it('should have one validation failure', (): void => {
        expect(failures).toHaveLength(1);
      });

      it('should have validation failure for property', (): void => {
        expect(failures[0].validatorName).toBe('CommonPropertyCollectionTargetMustContainIdentity');
        expect(failures[0].category).toBe('error');
        expect(failures[0].message).toMatchInlineSnapshot(
          `"Common property ${COMMON_SUB_ENTITY_NAME} cannot be used as a collection because Common Subclass ${COMMON_SUB_ENTITY_NAME} does not have any identity properties."`,
        );
        expect(failures[0].sourceMap).toMatchInlineSnapshot(`
          Object {
            "column": 11,
            "line": 19,
            "tokenText": "${COMMON_SUB_ENTITY_NAME}",
          }
        `);
      });
    });

    describe('and given the property has a superclass with identity', (): void => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      let failures: ValidationFailure[];
      let coreNamespace: any = null;

      beforeAll(() => {
        MetaEdTextBuilder.build()
          .withBeginNamespace('EdFi')
          .withStartCommon(COMMON_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          // Has an identity
          .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
          .withEndCommon()

          .withStartCommonSubclass(COMMON_SUB_ENTITY_NAME, COMMON_ENTITY_NAME)
          // Does not have an identity
          .withStringProperty('PropertyName2', 'Property2Documentation', true, false, '100')
          .withEndCommonSubclass()

          .withStartDomainEntity(DOMAIN_ENTITY_NAME)
          .withDocumentation('EntityDocumentation')
          .withCommonProperty(COMMON_SUB_ENTITY_NAME, 'PropertyDocumentation', true, true)
          .withEndDomainEntity()
          .withEndNamespace()

          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new DomainEntityBuilder(metaEd, []))
          .sendToListener(new CommonBuilder(metaEd, []))
          .sendToListener(new CommonSubclassBuilder(metaEd, []));

        coreNamespace = metaEd.namespace.get('EdFi');
        commonReferenceEnhancer(metaEd);
        commonSubclassBaseClassEnhancer(metaEd);

        failures = validate(metaEd);
      });

      it('should build one common', (): void => {
        expect(coreNamespace.entity.common.size).toBe(1);
      });

      it('should build one domain entity', (): void => {
        expect(coreNamespace.entity.domainEntity.size).toBe(1);
      });

      it('should have no validation failures', (): void => {
        expect(failures).toHaveLength(0);
      });
    });
  });

  describe('given the property has an identity', (): void => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    let failures: ValidationFailure[];
    let coreNamespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace('EdFi')
        .withStartCommon(COMMON_ENTITY_NAME)
        .withDocumentation('EntityDocumentation')
        .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
        .withEndCommon()

        .withStartDomainEntity(DOMAIN_ENTITY_NAME)
        .withDocumentation('EntityDocumentation')
        .withCommonProperty(COMMON_ENTITY_NAME, 'PropertyDocumentation', true, true)
        .withEndDomainEntity()
        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      coreNamespace = metaEd.namespace.get('EdFi');
      commonReferenceEnhancer(metaEd);

      failures = validate(metaEd);
    });

    it('should build one common', (): void => {
      expect(coreNamespace.entity.common.size).toBe(1);
    });

    it('should build one domain entity', (): void => {
      expect(coreNamespace.entity.domainEntity.size).toBe(1);
    });

    it('should have no validation failures', (): void => {
      expect(failures).toHaveLength(0);
    });
  });
});
