import { StringType } from '../model/StringType';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { ValidationFailure } from '../validator/ValidationFailure';
import { newStringType, NoStringType } from '../model/StringType';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText, extractDeprecationReason } from './BuilderUtility';
import type {
  DeprecatedContext,
  DocumentationContext,
  MaxLengthContext,
  MetaEdIdContext,
  MinLengthContext,
  NamespaceNameContext,
  PropertyDocumentationContext,
  SharedStringContext,
  SharedStringNameContext,
  SimplePropertyNameContext,
  StringPropertyContext,
} from '../grammar/gen/MetaEdGrammar';
import MetaEdGrammarListener from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';
import { NoNamespace } from '../model/Namespace';

// Note StringType is XSD specific with the advent of SharedString, and creation should be move to XSD enhancers
export class StringTypeBuilder extends MetaEdGrammarListener {
  currentStringType: StringType;

  metaEd: MetaEdEnvironment;

  currentNamespace: Namespace;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
    this.currentStringType = NoStringType;
  }

  enterNamespaceName = (context: NamespaceNameContext) => {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  };

  enterSharedString = (context: SharedStringContext) => {
    this.enteringStringType(context);
  };

  enterStringProperty = (context: StringPropertyContext) => {
    this.enteringStringType(context, true);
  };

  enteringStringType = (context: SharedStringContext | StringPropertyContext, generatedSimpleType: boolean = false) => {
    this.currentStringType = { ...newStringType(), namespace: this.currentNamespace, generatedSimpleType };
    this.currentStringType.sourceMap.type = sourceMapFrom(context);
  };

  enterDeprecated = (context: DeprecatedContext) => {
    if (this.currentStringType === NoStringType) return;

    if (!context.exception) {
      this.currentStringType.isDeprecated = true;
      this.currentStringType.deprecationReason = extractDeprecationReason(context);
      this.currentStringType.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentStringType.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  };

  enterDocumentation = (context: DocumentationContext) => {
    if (this.currentStringType === NoStringType || this.currentStringType.generatedSimpleType) return;
    this.currentStringType.documentation = extractDocumentation(context);
    this.currentStringType.sourceMap.documentation = sourceMapFrom(context);
  };

  enterPropertyDocumentation = (context: PropertyDocumentationContext) => {
    if (this.currentStringType === NoStringType) return;

    if (!context.exception && context.INHERITED() !== null) {
      this.currentStringType.documentationInherited = true;
      this.currentStringType.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentStringType.documentation = extractDocumentation(context);
      this.currentStringType.sourceMap.documentation = sourceMapFrom(context);
    }
  };

  enterSharedStringName = (context: SharedStringNameContext) => {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.currentStringType.metaEdName = context.ID().getText();
    this.currentStringType.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterSimplePropertyName = (context: SimplePropertyNameContext) => {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.localPropertyName() == null) return;
    const localPropertyNameContext = context.localPropertyName();
    if (
      localPropertyNameContext.exception ||
      localPropertyNameContext.ID() == null ||
      isErrorText(localPropertyNameContext.ID().getText())
    )
      return;
    this.currentStringType.metaEdName = localPropertyNameContext.ID().getText();
    this.currentStringType.sourceMap.metaEdName = sourceMapFrom(localPropertyNameContext);
  };

  enterMetaEdId = (context: MetaEdIdContext) => {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.METAED_ID() == null || isErrorText(context.METAED_ID().getText())) return;

    this.currentStringType.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
    this.currentStringType.sourceMap.metaEdId = sourceMapFrom(context);
  };

  enterMinLength = (context: MinLengthContext) => {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    this.currentStringType.minLength = context.UNSIGNED_INT().getText();
    this.currentStringType.sourceMap.minLength = sourceMapFrom(context);
  };

  enterMaxLength = (context: MaxLengthContext) => {
    if (this.currentStringType === NoStringType) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    this.currentStringType.maxLength = context.UNSIGNED_INT().getText();
    this.currentStringType.sourceMap.maxLength = sourceMapFrom(context);
  };

  exitStringProperty = (_context: StringPropertyContext) => {
    this.exitingStringType();
  };

  exitSharedString = (_context: SharedStringContext) => {
    this.exitingStringType();
  };

  exitingStringType() {
    if (this.currentStringType === NoStringType) return;

    // Another example of why StringType belongs in XSD specific, repository key partitions by namespace
    const { projectExtension } = this.currentNamespace;
    const repositoryId = projectExtension
      ? `${projectExtension}-${this.currentStringType.metaEdName}`
      : this.currentStringType.metaEdName;
    this.currentNamespace.entity[this.currentStringType.type].set(repositoryId, this.currentStringType);

    this.currentStringType = NoStringType;
  }
}
