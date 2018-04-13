// @flow
import type { DecimalType } from '../model/DecimalType';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { newDecimalType, NoDecimalType } from '../model/DecimalType';
import { namespaceName } from './NamespaceInfoBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText } from './BuilderUtility';
import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';

// Note DecimalType is XSD specific with the advent of SharedDecimal, and creation should be move to XSD enhancers
export class DecimalTypeBuilder extends MetaEdGrammarListener {
  currentDecimalType: DecimalType;
  metaEd: MetaEdEnvironment;
  currentNamespace: string;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = '';
    this.currentDecimalType = NoDecimalType;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    this.currentNamespace = namespaceName(context);
  }

  enterSharedDecimal(context: MetaEdGrammar.SharedDecimalContext) {
    this.enteringDecimalType(context);
  }

  enterDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext) {
    this.enteringDecimalType(context, true);
  }

  enteringDecimalType(
    context: MetaEdGrammar.SharedDecimalContext | MetaEdGrammar.DecimalPropertyContext,
    generatedSimpleType: boolean = false,
  ) {
    const namespaceInfo: ?NamespaceInfo = this.metaEd.entity.namespaceInfo.get(this.currentNamespace);
    if (namespaceInfo == null) return;
    this.currentDecimalType = { ...newDecimalType(), namespaceInfo, generatedSimpleType };
    this.currentDecimalType.sourceMap.type = sourceMapFrom(context);
    this.currentDecimalType.sourceMap.namespaceInfo = namespaceInfo.sourceMap.type;
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentDecimalType === NoDecimalType || this.currentDecimalType.generatedSimpleType) return;
    this.currentDecimalType.documentation = extractDocumentation(context);
    this.currentDecimalType.sourceMap.documentation = sourceMapFrom(context);
  }

  enterPropertyDocumentation(context: MetaEdGrammar.PropertyDocumentationContext) {
    if (this.currentDecimalType === NoDecimalType) return;

    if (!context.exception && context.INHERITED() !== null && !context.INHERITED().exception) {
      this.currentDecimalType.documentationInherited = true;
      this.currentDecimalType.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentDecimalType.documentation = extractDocumentation(context);
      this.currentDecimalType.sourceMap.documentation = sourceMapFrom(context);
    }
  }

  enterSharedDecimalName(context: MetaEdGrammar.SharedDecimalNameContext) {
    this.enteringDecimalTypeName(context);
  }

  enterPropertyName(context: MetaEdGrammar.PropertyNameContext) {
    this.enteringDecimalTypeName(context);
  }

  enteringDecimalTypeName(context: MetaEdGrammar.withContextNameContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentDecimalType.metaEdName = context.ID().getText();
    this.currentDecimalType.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (
      context.exception ||
      context.METAED_ID() == null ||
      context.METAED_ID().exception ||
      isErrorText(context.METAED_ID().getText())
    )
      return;

    this.currentDecimalType.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
    this.currentDecimalType.sourceMap.metaEdId = sourceMapFrom(context);
  }

  enterTotalDigits(context: MetaEdGrammar.TotalDigitsContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    this.currentDecimalType.totalDigits = context.UNSIGNED_INT().getText();
    this.currentDecimalType.sourceMap.totalDigits = sourceMapFrom(context);
  }

  enterDecimalPlaces(context: MetaEdGrammar.DecimalPlacesContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    this.currentDecimalType.decimalPlaces = context.UNSIGNED_INT().getText();
    this.currentDecimalType.sourceMap.decimalPlaces = sourceMapFrom(context);
  }

  enterMinValueDecimal(context: MetaEdGrammar.MinValueDecimalContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    this.currentDecimalType.minValue = context.decimalValue().getText();
    this.currentDecimalType.sourceMap.minValue = sourceMapFrom(context);
  }

  enterMaxValueDecimal(context: MetaEdGrammar.MaxValueDecimalContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    this.currentDecimalType.maxValue = context.decimalValue().getText();
    this.currentDecimalType.sourceMap.maxValue = sourceMapFrom(context);
  }

  // eslint-disable-next-line no-unused-vars
  exitDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext) {
    this.exitingDecimalType();
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedDecimal(context: MetaEdGrammar.SharedDecimalContext) {
    this.exitingDecimalType();
  }

  exitingDecimalType() {
    if (this.currentDecimalType === NoDecimalType) return;

    const projectExtension = this.currentDecimalType.namespaceInfo.projectExtension;
    const repositoryId = projectExtension
      ? `${projectExtension}-${this.currentDecimalType.metaEdName}`
      : this.currentDecimalType.metaEdName;
    // $FlowIgnore - allowing currentDecimalType.type to specify the entityRepository Map property
    this.metaEd.entity[this.currentDecimalType.type].set(repositoryId, this.currentDecimalType);

    this.currentDecimalType = NoDecimalType;
  }
}
