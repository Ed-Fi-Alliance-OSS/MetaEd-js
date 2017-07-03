// @flow
import type { IntegerType } from '../model/IntegerType';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { integerTypeFactory, shortTypeFactory, NoIntegerType } from '../model/IntegerType';
import { enteringNamespaceName, enteringNamespaceType } from './NamespaceInfoBuilder';
import { extractDocumentation, squareBracketRemoval, isErrorText } from './BuilderUtility';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../../grammar/gen/MetaEdGrammarListener';
import { namespaceInfoFactory, NoNamespaceInfo } from '../model/NamespaceInfo';
import { sourceMapFrom } from '../model/SourceMap';

// Note IntegerType is XSD specific with the advent of SharedInteger and SharedShort, and creation should be move to XSD enhancers
export default class IntegerTypeBuilder extends MetaEdGrammarListener {
  currentIntegerType: IntegerType;
  metaEd: MetaEdEnvironment;
  namespaceInfo: NamespaceInfo;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.namespaceInfo = NoNamespaceInfo;
    this.currentIntegerType = NoIntegerType;
  }

  enterNamespace(context: MetaEdGrammar.NamespaceContext) {
    if (this.namespaceInfo !== NoNamespaceInfo) return;
    this.namespaceInfo = namespaceInfoFactory();
    this.namespaceInfo.sourceMap.type = sourceMapFrom(context);
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.namespaceInfo = enteringNamespaceName(context, this.namespaceInfo);
  }

  enterNamespaceType(context: MetaEdGrammar.NamespaceTypeContext) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    this.namespaceInfo = enteringNamespaceType(context, this.namespaceInfo);
  }

  // eslint-disable-next-line no-unused-vars
  exitNamespace(context: MetaEdGrammar.NamespaceContext) {
    this.namespaceInfo = NoNamespaceInfo;
  }

  enterSharedInteger(context: MetaEdGrammar.SharedIntegerContext) {
    this.enteringIntegerType(context, { isShort: false, generatedSimpleType: false });
  }

  enterIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext) {
    this.enteringIntegerType(context, { isShort: false, generatedSimpleType: true });
  }

  enterSharedShort(context: MetaEdGrammar.SharedShortContext) {
    this.enteringIntegerType(context, { isShort: true, generatedSimpleType: false });
  }

  enterShortProperty(context: MetaEdGrammar.ShortPropertyContext) {
    this.enteringIntegerType(context, { isShort: true, generatedSimpleType: true });
  }

  enteringIntegerType(context: MetaEdGrammar.SharedIntegerContext |
    MetaEdGrammar.IntegerPropertyContext |
    MetaEdGrammar.SharedShortContext |
    MetaEdGrammar.ShortPropertyContext,
    { isShort, generatedSimpleType }: { isShort: boolean, generatedSimpleType: boolean }) {
    if (this.namespaceInfo === NoNamespaceInfo) return;
    const factory = isShort ? shortTypeFactory : integerTypeFactory;
    this.currentIntegerType = Object.assign(factory(), {
      namespaceInfo: this.namespaceInfo,
      generatedSimpleType,
    });
    this.currentIntegerType.sourceMap.type = sourceMapFrom(context);
    this.currentIntegerType.sourceMap.namespaceInfo = this.namespaceInfo.sourceMap.type;
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentIntegerType === NoIntegerType || this.currentIntegerType.generatedSimpleType) return;
    this.currentIntegerType.documentation = extractDocumentation(context);
    this.currentIntegerType.sourceMap.documentation = sourceMapFrom(context);
  }

  enterPropertyDocumentation(context: MetaEdGrammar.PropertyDocumentationContext) {
    if (this.currentIntegerType === NoIntegerType) return;

    if (!context.exception && context.INHERITED() !== null && !context.INHERITED().exception) {
      this.currentIntegerType.documentationInherited = true;
      this.currentIntegerType.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentIntegerType.documentation = extractDocumentation(context);
      this.currentIntegerType.sourceMap.documentation = sourceMapFrom(context);
    }
  }

  enterSharedIntegerName(context: MetaEdGrammar.SharedIntegerNameContext) {
    this.enteringIntegerTypeName(context);
  }

  enterSharedShortName(context: MetaEdGrammar.SharedShortNameContext) {
    this.enteringIntegerTypeName(context);
  }

  enterPropertyName(context: MetaEdGrammar.PropertyNameContext) {
    this.enteringIntegerTypeName(context);
  }

  enteringIntegerTypeName(context: MetaEdGrammar.withContextNameContext) {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentIntegerType.metaEdName = context.ID().getText();
    this.currentIntegerType.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.METAED_ID() == null || context.METAED_ID().exception || isErrorText(context.METAED_ID().getText())) return;

    this.currentIntegerType.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
    this.currentIntegerType.sourceMap.metaEdId = sourceMapFrom(context);
  }

  enterMinValue(context: MetaEdGrammar.MinValueContext) {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.signed_int() == null || context.signed_int().exception || isErrorText(context.signed_int().getText())) return;
    this.currentIntegerType.minValue = context.signed_int().getText();
    this.currentIntegerType.sourceMap.minValue = sourceMapFrom(context);
  }

  enterMaxValue(context: MetaEdGrammar.MaxValueContext) {
    if (this.currentIntegerType === NoIntegerType) return;
    if (context.exception || context.signed_int() == null || context.signed_int().exception || isErrorText(context.signed_int().getText())) return;
    this.currentIntegerType.maxValue = context.signed_int().getText();
    this.currentIntegerType.sourceMap.maxValue = sourceMapFrom(context);
  }

  // eslint-disable-next-line no-unused-vars
  exitIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext) {
    this.exitingIntegerType();
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedInteger(context: MetaEdGrammar.SharedIntegerContext) {
    this.exitingIntegerType();
  }

  // eslint-disable-next-line no-unused-vars
  exitShortProperty(context: MetaEdGrammar.ShortPropertyContext) {
    this.exitingIntegerType();
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedShort(context: MetaEdGrammar.SharedShortContext) {
    this.exitingIntegerType();
  }

  exitingIntegerType() {
    if (this.currentIntegerType === NoIntegerType) return;

    if (this.currentIntegerType.metaEdName) {
      // $FlowIgnore - allowing currentIntegerType.type to specify the entityRepository Map property
      const currentIntegerTypeRepository = this.metaEd.entity[this.currentIntegerType.type];
      if (currentIntegerTypeRepository.has(this.currentIntegerType.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'IntegerTypeBuilder',
          category: 'error',
          message: `${this.currentIntegerType.typeHumanizedName} named ${this.currentIntegerType.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentIntegerType.sourceMap.type,
          fileMap: null,
        });
        const duplicateEntity: IntegerType = currentIntegerTypeRepository.get(this.currentIntegerType.metaEdName);
        this.validationFailures.push({
          validatorName: 'IntegerTypeBuilder',
          category: 'error',
          message: `${duplicateEntity.typeHumanizedName} named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.type,
          fileMap: null,
        });
      } else {
        currentIntegerTypeRepository.set(this.currentIntegerType.metaEdName, this.currentIntegerType);
      }
    }
    this.currentIntegerType = NoIntegerType;
  }
}
