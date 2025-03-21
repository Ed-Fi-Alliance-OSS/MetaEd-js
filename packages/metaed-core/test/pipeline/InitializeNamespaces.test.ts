// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newState } from '../../src/State';
import { State } from '../../src/State';
import { newNamespace } from '../../src/model/Namespace';
import { Namespace } from '../../src/model/Namespace';
import { initializeNamespaces } from '../../src/pipeline/InitializeNamespaces';

describe('when enhancing core namespace only', (): void => {
  const state: State = newState();
  const coreNamespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };

  beforeAll(() => {
    state.metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
    initializeNamespaces(state);
  });

  it('should have no dependencies for core', (): void => {
    expect(coreNamespace.dependencies).toHaveLength(0);
  });
});

describe('when enhancing core and extension namespace', (): void => {
  const state: State = newState();
  const coreNamespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', isExtension: true };

  beforeAll(() => {
    state.metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
    state.metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
    initializeNamespaces(state);
  });

  it('should have no dependencies for core', (): void => {
    expect(coreNamespace.dependencies).toHaveLength(0);
  });

  it('should have core dependencies for extension', (): void => {
    expect(extensionNamespace.dependencies).toHaveLength(1);
    expect(extensionNamespace.dependencies[0]).toBe(coreNamespace);
  });
});
