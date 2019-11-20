import { ParserRuleContext } from 'antlr4/ParserRuleContext';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { ValidationFailure, ValidationFailureCategory } from '../validator/ValidationFailure';
import { namespaceNameFrom } from './NamespaceBuilder';
import { Namespace, NoNamespace } from '../model/Namespace';
import { sourceMapFrom } from '../model/SourceMap';

const validatorName = 'SyntaxValidatingBuilder';
const category: ValidationFailureCategory = 'warning';

const willBeDeprecated = 'will be deprecated in a future version of MetaEd.';

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
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(deprecationWarning(context, `The 'is weak' keyword`));
    }
  }

  // Deprecate 'is queryable only'
  enterIsQueryableOnly(context: MetaEdGrammar.IsQueryableOnlyContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(deprecationWarning(context, `The 'is queryable only' keyword`));
    }
  }

  // Deprecate 'is queryable field'
  enterIsQueryableField(context: MetaEdGrammar.IsQueryableFieldContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(deprecationWarning(context, `The 'is queryable field' keyword`));
    }
  }

  // deprecate 'shorten to'
  enterShortenToName(context: MetaEdGrammar.ShortenToNameContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(deprecationWarning(context, `The 'shorten to' keyword`));
    }
  }

  // deprecate 'renames identity property' in extensions
  enterIdentityRename(context: MetaEdGrammar.IdentityRenameContext) {
    if (this.currentNamespace.isExtension) {
      this.validationFailures.push(deprecationWarning(context, `The 'renames identity property' keyword`));
    }
  }

  // deprecate 'Shared Short'
  enterSharedShort(context: MetaEdGrammar.SharedShortContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(
        newValidationFailure(
          context,
          `The 'Shared Short' entity ${willBeDeprecated} Use 'Shared Integer' with a max value instead.`,
        ),
      );
    }
  }

  // deprecate 'shared short'
  enterSharedShortProperty(context: MetaEdGrammar.SharedShortPropertyContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(
        newValidationFailure(
          context,
          `The 'shared short' property ${willBeDeprecated} Use 'shared integer' and reference a Shared Integer with a max value instead.`,
        ),
      );
    }
  }

  // deprecate 'short'
  enterShortProperty(context: MetaEdGrammar.ShortPropertyContext) {
    if (this.currentNamespace.isExtension || this.metaEd.allianceMode) {
      this.validationFailures.push(
        newValidationFailure(context, `The 'short' property ${willBeDeprecated} Use 'integer' with a max value instead.`),
      );
    }
  }
}
