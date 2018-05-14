// @flow
import type { StringType } from '../model/StringType';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { Namespace } from '../model/Namespace';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { newStringType, NoStringType } from '../model/StringType';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText } from './BuilderUtility';
import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';
import { NoNamespace } from '../model/Namespace';

// Note StringType is XSD specific with the advent of SharedString, and creation should be move to XSD enhancers
export class StringTypeBuilder extends MetaEdGrammarListener {
  currentStringType: StringType;
  metaEd: MetaEdEnvironment;
  currentNamespace: Namespace;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
    this.currentStringType = NoStringType;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: ?Namespace = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  enterSharedString(context: MetaEdGrammar.SharedStringContext) {
    this.enteringStringType(context);
  }

  enterStringProperty(context: MetaEdGrammar.StringPropertyContext) {
    this.enteringStringType(context, true);
  }

  enteringStringType(
    context: MetaEdGrammar.SharedStringContext | MetaEdGrammar.StringPropertyContext,
    generatedSimpleType: boolean = false,
  ) {
    this.currentStringType = { ...newStringType(), namespace: this.currentNamespace, generatedSimpleType };
    this.currentStringType.sourceMap.type = sourceMapFrom(context);
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentStringType === NoStringType || this.currentStringType.generatedSimpleType) return;
    this.currentStringType.documentation = extractDocumentation(context);
    this.currentStringType.sourceMap.documentation = sourceMapFrom(context);
  }

  enterPropertyDocumentation(context: MetaEdGrammar.PropertyDocumentationContext) {
    if (this.currentStringType === NoStringType) return;

    if (!context.exception && context.INHERITED() !== null && !context.INHERITED().exception) {
      this.currentStringType.documentationInherited = true;
      this.currentStringType.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentStringType.documentation = extractDocumentation(context);
      this.currentStringType.sourceMap.documentation = sourceMapFrom(context);
    }
  }

  enterSharedStringName(context: MetaEdGrammar.SharedStringNameContext) {
    this.enteringStringTypeName(context);
  }

  enterPropertyName(context: MetaEdGrammar.PropertyNameContext) {
    this.enteringStringTypeName(context);
  }

  enteringStringTypeName(context: MetaEdGrammar.withContextNameContext) {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentStringType.metaEdName = context.ID().getText();
    this.currentStringType.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (this.currentStringType === NoStringType) return;
    if (
      context.exception ||
      context.METAED_ID() == null ||
      context.METAED_ID().exception ||
      isErrorText(context.METAED_ID().getText())
    )
      return;

    this.currentStringType.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
    this.currentStringType.sourceMap.metaEdId = sourceMapFrom(context);
  }

  enterMinLength(context: MetaEdGrammar.MinLengthContext) {
    if (this.currentStringType === NoStringType) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    this.currentStringType.minLength = context.UNSIGNED_INT().getText();
    this.currentStringType.sourceMap.minLength = sourceMapFrom(context);
  }

  enterMaxLength(context: MetaEdGrammar.MaxLengthContext) {
    if (this.currentStringType === NoStringType) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    this.currentStringType.maxLength = context.UNSIGNED_INT().getText();
    this.currentStringType.sourceMap.maxLength = sourceMapFrom(context);
  }

  // eslint-disable-next-line no-unused-vars
  exitStringProperty(context: MetaEdGrammar.StringPropertyContext) {
    this.exitingStringType();
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedString(context: MetaEdGrammar.SharedStringContext) {
    this.exitingStringType();
  }

  exitingStringType() {
    if (this.currentStringType === NoStringType) return;

    // Another example of why StringType belongs in XSD specific, repository key partitions by namespace
    const projectExtension = this.currentNamespace.projectExtension;
    const repositoryId = projectExtension
      ? `${projectExtension}-${this.currentStringType.metaEdName}`
      : this.currentStringType.metaEdName;
    // $FlowIgnore - allowing currentStringType.type to specify the entityRepository Map property
    this.currentNamespace.entity[this.currentStringType.type].set(repositoryId, this.currentStringType);

    this.currentStringType = NoStringType;
  }
}
