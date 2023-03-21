import { IntegerType } from '../model/IntegerType';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { ValidationFailure } from '../validator/ValidationFailure';
import { newIntegerType, newShortType, NoIntegerType } from '../model/IntegerType';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, extractDeprecationReason, squareBracketRemoval, isErrorText } from './BuilderUtility';
import type {
  DeprecatedContext,
  DocumentationContext,
  IntegerPropertyContext,
  MaxValueContext,
  MetaEdIdContext,
  MinValueContext,
  NamespaceNameContext,
  PropertyDocumentationContext,
  RoleNameNameContext,
  SharedIntegerContext,
  SharedIntegerNameContext,
  SharedShortContext,
  SharedShortNameContext,
  ShortPropertyContext,
  SimplePropertyNameContext,
} from '../grammar/gen/MetaEdGrammar';
import MetaEdGrammarListener from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';
import { NoNamespace } from '../model/Namespace';

// Note IntegerType is XSD specific with the advent of SharedInteger and SharedShort, and creation should be move to XSD enhancers
export class IntegerTypeBuilder extends MetaEdGrammarListener {
  currentIntegerType: IntegerType;

  metaEd: MetaEdEnvironment;

  currentNamespace: Namespace;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
    this.currentIntegerType = NoIntegerType;
  }

  enterNamespaceName = (context: NamespaceNameContext) => {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  };

  enterSharedInteger = (context: SharedIntegerContext) => {
    this.enteringIntegerType(context, { isShort: false, generatedSimpleType: false });
  };

  enterIntegerProperty = (context: IntegerPropertyContext) => {
    this.enteringIntegerType(context, { isShort: false, generatedSimpleType: true });
  };

  enterSharedShort = (context: SharedShortContext) => {
    this.enteringIntegerType(context, { isShort: true, generatedSimpleType: false });
  };

  enterShortProperty = (context: ShortPropertyContext) => {
    this.enteringIntegerType(context, { isShort: true, generatedSimpleType: true });
  };

  enteringIntegerType(
    context: SharedIntegerContext | IntegerPropertyContext | SharedShortContext | ShortPropertyContext,
    { isShort, generatedSimpleType }: { isShort: boolean; generatedSimpleType: boolean },
  ) {
    const factory = isShort ? newShortType : newIntegerType;
    this.currentIntegerType = { ...factory(), namespace: this.currentNamespace, generatedSimpleType };

    this.currentIntegerType.sourceMap.type = sourceMapFrom(context);
  }

  enterDeprecated = (context: DeprecatedContext) => {
    if (this.currentIntegerType === NoIntegerType) return;

    if (!context.exception) {
      this.currentIntegerType.isDeprecated = true;
      this.currentIntegerType.deprecationReason = extractDeprecationReason(context);
      this.currentIntegerType.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentIntegerType.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  };

  enterDocumentation = (context: DocumentationContext) => {
    if (this.currentIntegerType === NoIntegerType || this.currentIntegerType.generatedSimpleType) return;
    this.currentIntegerType.documentation = extractDocumentation(context);
    this.currentIntegerType.sourceMap.documentation = sourceMapFrom(context);
  };

  enterPropertyDocumentation = (context: PropertyDocumentationContext) => {
    if (this.currentIntegerType === NoIntegerType) return;

    if (!context.exception && context.INHERITED() !== null) {
      this.currentIntegerType.documentationInherited = true;
      this.currentIntegerType.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentIntegerType.documentation = extractDocumentation(context);
      this.currentIntegerType.sourceMap.documentation = sourceMapFrom(context);
    }
  };

  enterSharedIntegerName = (context: SharedIntegerNameContext) => {
    this.enteringIntegerTypeName(context);
  };

  enterSharedShortName = (context: SharedShortNameContext) => {
    this.enteringIntegerTypeName(context);
  };

  enterSimplePropertyName = (context: SimplePropertyNameContext) => {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.localPropertyName() == null) return;
    const localPropertyNameContext = context.localPropertyName();
    if (
      localPropertyNameContext.exception ||
      localPropertyNameContext.ID() == null ||
      isErrorText(localPropertyNameContext.ID().getText())
    )
      return;
    this.currentIntegerType.metaEdName = localPropertyNameContext.ID().getText();
    this.currentIntegerType.sourceMap.metaEdName = sourceMapFrom(localPropertyNameContext);
  };

  enteringIntegerTypeName = (context: RoleNameNameContext) => {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.currentIntegerType.metaEdName = context.ID().getText();
    this.currentIntegerType.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterMetaEdId = (context: MetaEdIdContext) => {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.METAED_ID() == null || isErrorText(context.METAED_ID().getText())) return;

    this.currentIntegerType.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
    this.currentIntegerType.sourceMap.metaEdId = sourceMapFrom(context);
  };

  enterMinValue = (context: MinValueContext) => {
    if (this.currentIntegerType === NoIntegerType) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    this.currentIntegerType.minValue = context.signed_int().getText();
    this.currentIntegerType.sourceMap.minValue = sourceMapFrom(context);
  };

  enterMaxValue = (context: MaxValueContext) => {
    if (this.currentIntegerType === NoIntegerType) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    this.currentIntegerType.maxValue = context.signed_int().getText();
    this.currentIntegerType.sourceMap.maxValue = sourceMapFrom(context);
  };

  exitIntegerProperty = (_context: IntegerPropertyContext) => {
    this.exitingIntegerType();
  };

  exitSharedInteger = (_context: SharedIntegerContext) => {
    this.exitingIntegerType();
  };

  exitShortProperty = (_context: ShortPropertyContext) => {
    this.exitingIntegerType();
  };

  exitSharedShort = (_context: SharedShortContext) => {
    this.exitingIntegerType();
  };

  exitingIntegerType() {
    if (this.currentIntegerType === NoIntegerType) return;

    const { projectExtension } = this.currentNamespace;
    const repositoryId = projectExtension
      ? `${projectExtension}-${this.currentIntegerType.metaEdName}`
      : this.currentIntegerType.metaEdName;
    this.currentNamespace.entity[this.currentIntegerType.type].set(repositoryId, this.currentIntegerType);

    this.currentIntegerType = NoIntegerType;
  }
}
