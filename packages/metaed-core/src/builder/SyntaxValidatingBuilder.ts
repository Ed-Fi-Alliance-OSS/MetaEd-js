// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { ParserRuleContext } from '@edfi/antlr4/ParserRuleContext';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { ValidationFailure, ValidationFailureCategory } from '../validator/ValidationFailure';
import { namespaceNameFrom } from './NamespaceBuilder';
import { Namespace, NoNamespace } from '../model/Namespace';
import { sourceMapFrom } from '../model/SourceMap';
import { versionSatisfies } from '../Utility';

const validatorName = 'SyntaxValidatingBuilder';
const category: ValidationFailureCategory = 'warning';

const willBeDeprecated = 'will be deprecated in a future version of MetaEd.';

const targetDataStandardVersion331b: string = '>=3.3.1-b';

function newValidationFailure(context: ParserRuleContext, message: string): ValidationFailure {
  return {
    validatorName,
    category,
    message,
    sourceMap: sourceMapFrom(context),
    fileMap: null,
  };
}

function deprecationWarning(context: ParserRuleContext, partialMessage: string): ValidationFailure {
  return newValidationFailure(context, `${partialMessage} ${willBeDeprecated}`);
}

/**
 * An ANTLR4 listener that creates ValidationFailures for legal but disfavored syntax
 */
export class SyntaxValidatingBuilder extends MetaEdGrammarListener {
  metaEd: MetaEdEnvironment;

  validationFailures: ValidationFailure[];

  currentNamespace: Namespace;

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  // Deprecate 'is weak'
  enterIsWeakReference(context: MetaEdGrammar.IsWeakReferenceContext) {
    if (versionSatisfies(this.metaEd.dataStandardVersion, targetDataStandardVersion331b)) {
      this.validationFailures.push({
        validatorName,
        category: 'error',
        message: "The 'is weak' keyword has been deprecated, as it is not compatible with data standard versions > 3.2.x",
        sourceMap: sourceMapFrom(context),
        fileMap: null,
      });
      return;
    }

    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(deprecationWarning(context, `The 'is weak' keyword`));
    }
  }

  // deprecate 'renames identity property' in extensions
  enterIdentityRename(context: MetaEdGrammar.IdentityRenameContext) {
    if (this.currentNamespace.isExtension) {
      this.validationFailures.push(deprecationWarning(context, `The 'renames identity property' keyword`));
    }
  }
}
