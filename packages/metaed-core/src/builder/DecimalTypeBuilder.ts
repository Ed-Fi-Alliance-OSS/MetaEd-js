// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DecimalType } from '../model/DecimalType';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { ValidationFailure } from '../validator/ValidationFailure';
import { newDecimalType, NoDecimalType } from '../model/DecimalType';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, extractDeprecationReason, isErrorText } from './BuilderUtility';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';
import { NoNamespace } from '../model/Namespace';

// Note DecimalType is XSD specific with the advent of SharedDecimal, and creation should be move to XSD enhancers
export class DecimalTypeBuilder extends MetaEdGrammarListener {
  currentDecimalType: DecimalType;

  metaEd: MetaEdEnvironment;

  currentNamespace: Namespace;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
    this.currentDecimalType = NoDecimalType;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
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
    this.currentDecimalType = { ...newDecimalType(), namespace: this.currentNamespace, generatedSimpleType };
    this.currentDecimalType.sourceMap.type = sourceMapFrom(context);
  }

  enterDeprecated(context: MetaEdGrammar.DeprecatedContext) {
    if (this.currentDecimalType === NoDecimalType) return;

    if (!context.exception) {
      this.currentDecimalType.isDeprecated = true;
      this.currentDecimalType.deprecationReason = extractDeprecationReason(context);
      this.currentDecimalType.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentDecimalType.sourceMap.deprecationReason = sourceMapFrom(context);
    }
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
    if (this.currentDecimalType === NoDecimalType) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentDecimalType.metaEdName = context.ID().getText();
    this.currentDecimalType.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterSimplePropertyName(context: MetaEdGrammar.SimplePropertyNameContext) {
    if (this.currentDecimalType === NoDecimalType) return;
    if (context.exception || context.localPropertyName() == null) return;
    const localPropertyNameContext = context.localPropertyName();
    if (
      localPropertyNameContext.exception ||
      localPropertyNameContext.ID() == null ||
      localPropertyNameContext.ID().exception ||
      isErrorText(localPropertyNameContext.ID().getText())
    )
      return;
    this.currentDecimalType.metaEdName = localPropertyNameContext.ID().getText();
    this.currentDecimalType.sourceMap.metaEdName = sourceMapFrom(localPropertyNameContext);
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

  exitDecimalProperty(_context: MetaEdGrammar.DecimalPropertyContext) {
    this.exitingDecimalType();
  }

  exitSharedDecimal(_context: MetaEdGrammar.SharedDecimalContext) {
    this.exitingDecimalType();
  }

  exitingDecimalType() {
    if (this.currentDecimalType === NoDecimalType) return;

    const { projectExtension } = this.currentNamespace;
    const repositoryId = projectExtension
      ? `${projectExtension}-${this.currentDecimalType.metaEdName}`
      : this.currentDecimalType.metaEdName;
    this.currentNamespace.entity[this.currentDecimalType.type].set(repositoryId, this.currentDecimalType);

    this.currentDecimalType = NoDecimalType;
  }
}
