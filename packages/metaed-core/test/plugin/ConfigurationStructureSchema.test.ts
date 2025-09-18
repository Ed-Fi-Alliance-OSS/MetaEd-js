// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { configurationStructureSchema } from '../../src/plugin/ConfigurationSchema';

describe('when config is single plugin level rule', (): void => {
  const configToTest = {
    config: {
      rule: '35113',
      data: {
        explainer: 'this object goes on the plugin that is in scope',
      },
    },
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config is single plugin level rule in array', (): void => {
  const configToTest = {
    config: [
      {
        rule: '35113',
        data: {
          explainer: 'this object goes on the plugin that is in scope',
        },
      },
    ],
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config is single rule with matches', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: [
        {
          entity: ['domainEntity', 'association'],
          extensions: true,
        },
      ],
      data: {
        explainer: 'this object goes on all domain entities and associations in extension namespaces',
      },
    },
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config is single rule in array with matches', (): void => {
  const configToTest = {
    config: [
      {
        rule: '4433334',
        matches: [
          {
            entity: ['domainEntity', 'association'],
            extensions: true,
          },
        ],
        data: {
          explainer: 'this object goes on all domain entities and associations in extension namespaces',
        },
      },
    ],
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config is multiple rules', (): void => {
  const configToTest = {
    config: [
      {
        rule: '4433334',
        matches: [
          {
            entity: ['domainEntity', 'association'],
            extensions: true,
          },
        ],
        data: {
          explainer: 'this object goes on all domain entities and associations in extension namespaces',
        },
      },
      {
        rule: '1133334',
        matches: [
          {
            entity: ['domainEntity', 'association'],
            extensions: true,
          },
        ],
        data: {
          explainer: 'this object goes on all domain entities and associations in extension namespaces',
        },
      },
    ],
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config has single match', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entity: ['domainEntity', 'association'],
        extensions: true,
      },

      data: {
        explainer: 'this object goes on all domain entities and associations in extension namespaces',
      },
    },
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config has single match', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entity: ['domainEntity', 'association'],
        extensions: true,
      },

      data: {
        explainer: 'this object goes on all domain entities and associations in extension namespaces',
      },
    },
  };

  it('should be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).toBeUndefined();
  });
});

describe('when config has invalid entity type', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entity: 'invalid',
      },

      data: {
        explainer: 'this is not a valid entity type',
      },
    },
  };

  it('should not be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).not.toBeNull();
    expect(result.error).toMatchInlineSnapshot(
      `[ValidationError: "config.matches.entity" must be one of [association, associationExtension, associationSubclass, choice, common, commonExtension, commonSubclass, descriptor, domainEntity, domainEntityExtension, domainEntitySubclass, enumeration, schoolYearEnumeration]]`,
    );
  });
});

describe('when config has matches with core flag along with namespace', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entity: ['domainEntity', 'association'],
        namespace: 'xyz',
        core: true,
      },

      data: {
        explainer: 'this is not a valid pairing',
      },
    },
  };

  it('should not be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).not.toBeNull();
    expect(result.error).toMatchInlineSnapshot(`[ValidationError: "namespace" conflict with forbidden peer "core"]`);
  });
});

describe('when config has matches with extensions flag along with namespace', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entity: ['domainEntity', 'association'],
        namespace: 'xyz',
        extensions: true,
      },

      data: {
        explainer: 'this is not a valid pairing',
      },
    },
  };

  it('should not be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).not.toBeNull();
    expect(result.error).toMatchInlineSnapshot(`[ValidationError: "namespace" conflict with forbidden peer "extensions"]`);
  });
});

describe('when config has matches with entityName but without entity type', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        entityName: 'NeedsTypeDefined',
      },

      data: {
        explainer: 'this is not valid wihout entity',
      },
    },
  };

  it('should not be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).not.toBeNull();
    expect(result.error).toMatchInlineSnapshot(
      `[ValidationError: "config.matches.entity" is required. "entityName" missing required peer "entity"]`,
    );
  });
});

describe('when config has invalid matches field', (): void => {
  const configToTest = {
    config: {
      rule: '4433334',
      matches: {
        invalid: 'yes',
      },

      data: {
        explainer: 'this is not a valid field',
      },
    },
  };

  it('should not be valid', (): void => {
    const result = configurationStructureSchema.validate(configToTest, { abortEarly: false });
    expect(result.error).not.toBeNull();
    expect(result.error).toMatchInlineSnapshot(
      `[ValidationError: "config.matches.entity" is required. "config.matches.invalid" is not allowed]`,
    );
  });
});
