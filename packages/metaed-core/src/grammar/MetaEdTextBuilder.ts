// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable max-classes-per-file */
import antlr4 from '@edfi/antlr4';
import { MetaEdGrammar } from './gen/MetaEdGrammar';
import { MetaEdGrammarListener } from './gen/MetaEdGrammarListener';
import { BaseLexer } from './gen/BaseLexer';

/**
 * ErrorListener is an ANTLR4 ErrorListener used in unit testing to collect syntax errors from the ANTLR parser.
 */
class ErrorListener {
  errorMessages: string[];

  constructor() {
    antlr4.error.ErrorListener.call(this);
    this.errorMessages = [];
  }

  syntaxError(_1: any, offendingSymbol: any, line: number, column: number, message: string) {
    const tokenText = offendingSymbol && offendingSymbol.text ? offendingSymbol.text : '';
    this.errorMessages.push(`${message}, column: ${column}, line: ${line}, token: ${tokenText}`);
  }
}

function listen(metaEdText: string, listener: MetaEdGrammarListener): string[] {
  const errorListener = new ErrorListener();
  const lexer = new BaseLexer(new antlr4.InputStream(metaEdText));
  const parser = new MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);
  const parserContext = parser.metaEd();
  const parseTreeWalker = new antlr4.tree.ParseTreeWalker();
  parseTreeWalker.walk(listener, parserContext);
  const result = errorListener.errorMessages;

  lexer.removeErrorListeners();
  parser.removeErrorListeners();

  return result;
}

/**
 * MetaEdTextBuilder is a fluent generator of MetaEd language text useful for setting up unit testing scenarios.
 * Language text can be described with chained functions and the resulting text can be sent to one or more Builders (ANTLR4
 * parse listeners) to create an EntityRepository representation.
 *
 * @example
 * MetaEdTextBuilder.build()
 * .withBeginNamespace(namespaceName)
 * .withStartDomainEntity(entityName)
 * .withDocumentation('doc')
 * .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
 * .withEndDomainEntity()
 * .withEndNamespace()
 * .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
 * .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
 */
export class MetaEdTextBuilder {
  textLines: string[];

  indentationLevel: number;

  errorMessages: string[];

  /**
   * @hideconstructor
   */
  constructor() {
    this.textLines = [];
    this.indentationLevel = 0;
    this.errorMessages = [];
  }

  /**
   * A static convenience method for getting a new MetaEdTextBuilder.
   */
  static build() {
    return new MetaEdTextBuilder();
  }

  /**
   * Chainable method to fire parse events to a Builder (ANTLR4 parse listener)
   */
  sendToListener(listener: MetaEdGrammarListener): MetaEdTextBuilder {
    const metaEdText = this.toString();
    this.errorMessages.push(...listen(metaEdText, listener));
    return this;
  }

  toString(): string {
    return this.textLines.join('\r\n');
  }

  toConsole(): void {
    // eslint-disable-next-line no-console
    console.log([this.toString(), this.errorMessages.join('\r\n')].join('\r\n'));
  }

  getIndentation(): string {
    return ' '.repeat(this.indentationLevel * 2);
  }

  increaseIndentation() {
    this.indentationLevel += 1;
  }

  decreaseIndentation() {
    this.indentationLevel -= 1;
  }

  addLineWithoutIndentation(line: string) {
    this.textLines.push(line);
  }

  addLine(line: string) {
    const indention = this.getIndentation();
    this.textLines.push(indention + line);
  }

  withBlankLine(): MetaEdTextBuilder {
    this.addLineWithoutIndentation('');
    return this;
  }

  withTrailingText(text: string): MetaEdTextBuilder {
    const idx = this.textLines.length - 1;
    this.textLines[idx] += text;
    return this;
  }

  /**
   *
   */
  withBeginNamespace(identifier: string, projectExtension: string | null = null): MetaEdTextBuilder {
    if (projectExtension == null) {
      this.addLine(`Begin Namespace ${identifier} core`);
    } else {
      this.addLine(`Begin Namespace ${identifier} ${projectExtension}`);
    }
    this.increaseIndentation();
    return this;
  }

  /**
   *
   */
  withEndNamespace(): MetaEdTextBuilder {
    this.decreaseIndentation();
    this.addLine('End Namespace');
    return this;
  }

  withComment(comment: string): MetaEdTextBuilder {
    this.addLine(`//${comment}`);
    return this;
  }

  /**
   *
   */
  withDeprecated(deprecationReason: string): MetaEdTextBuilder {
    this.addLine(`deprecated "${deprecationReason}"`);
    return this;
  }

  /**
   *
   */
  withDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'documentation';
    this.addLine(documentationToken);
    return this.withDocumentationLine(documentation);
  }

  withExtendedDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'extended documentation';
    this.addLine(documentationToken);
    return this.withDocumentationLine(documentation);
  }

  withUseCaseDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'use case documentation';
    this.addLine(documentationToken);
    return this.withDocumentationLine(documentation);
  }

  withFooterDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'footer documentation';
    this.addLine(documentationToken);
    return this.withDocumentationLine(documentation);
  }

  withDocumentationLine(documentation: string): MetaEdTextBuilder {
    if (documentation === 'inherited') {
      this.addLine(documentation);
    } else {
      this.addLine(`"${documentation}"`);
    }
    return this;
  }

  withChildElement(elementType: string, identifier: string): MetaEdTextBuilder {
    this.addLine(`${elementType} ${identifier}`);
    return this;
  }

  withStartTopLevel(keyword: string, identifier: string): MetaEdTextBuilder {
    this.addLine(`${keyword} ${identifier}`);
    this.increaseIndentation();
    return this;
  }

  withStartTopLevelSubclass(keyword: string, identifier: string, baseIdentifier: string): MetaEdTextBuilder {
    this.addLine(`${keyword} ${identifier} based on ${baseIdentifier}`);
    this.increaseIndentation();
    return this;
  }

  withStartTopLevelExtension(keyword: string, identifier: string): MetaEdTextBuilder {
    this.addLine(`${keyword} ${identifier} additions`);
    this.increaseIndentation();
    return this;
  }

  withEndTopLevel(): MetaEdTextBuilder {
    this.decreaseIndentation();
    return this;
  }

  /**
   *
   */
  withCascadeUpdate(): MetaEdTextBuilder {
    this.addLine('allow primary key updates');
    return this;
  }

  /**
   *
   */
  withStartMapType(isRequired: boolean = true): MetaEdTextBuilder {
    this.addLine(isRequired ? 'with map type' : 'with optional map type');
    this.increaseIndentation();
    return this;
  }

  /**
   *
   */
  withEndMapType(): MetaEdTextBuilder {
    this.decreaseIndentation();
    return this;
  }

  /**
   *
   */
  withStartEnumeration(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Enumeration', identifier);
  }

  /**
   *
   */
  withEndEnumeration(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartDescriptor(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Descriptor', identifier);
  }

  /**
   *
   */
  withEndDescriptor(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartDomainEntity(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Domain Entity', identifier);
  }

  /**
   *
   */
  withEndDomainEntity(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartAssociationExtension(extensionName: string): MetaEdTextBuilder {
    return this.withStartTopLevelExtension('Association', extensionName);
  }

  /**
   *
   */
  withEndAssociationExtension(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartDomainEntityExtension(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevelExtension('Domain Entity', identifier);
  }

  /**
   *
   */
  withEndDomainEntityExtension(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartAbstractEntity(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Abstract Entity', identifier);
  }

  /**
   *
   */
  withEndAbstractEntity(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartChoice(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Choice', identifier);
  }

  /**
   *
   */
  withEndChoice(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartSharedDecimal(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Shared Decimal', identifier);
  }

  /**
   *
   */
  withEndSharedDecimal(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartSharedInteger(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Shared Integer', identifier);
  }

  /**
   *
   */
  withEndSharedInteger(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartSharedShort(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Shared Short', identifier);
  }

  /**
   *
   */
  withEndSharedShort(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartSharedString(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Shared String', identifier);
  }

  /**
   *
   */
  withEndSharedString(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartCommon(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Common', identifier);
  }

  /**
   *
   */
  withEndCommon(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartCommonExtension(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevelExtension('Common', identifier);
  }

  /**
   *
   */
  withEndCommonExtension(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartInlineCommon(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Inline Common', identifier);
  }

  /**
   *
   */
  withEndInlineCommon(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartAssociation(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Association', identifier);
  }

  /**
   *
   */
  withEndAssociation(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartAssociationSubclass(associationName: string, baseAssociationName: string): MetaEdTextBuilder {
    return this.withStartTopLevelSubclass('Association', associationName, baseAssociationName);
  }

  /**
   *
   */
  withEndAssociationSubclass(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartCommonSubclass(commonName: string, baseCommonName: string): MetaEdTextBuilder {
    return this.withStartTopLevelSubclass('Common', commonName, baseCommonName);
  }

  /**
   *
   */
  withEndCommonSubclass(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  /**
   *
   */
  withStartDomainEntitySubclass(entityName: string, baseEntityName: string): MetaEdTextBuilder {
    return this.withStartTopLevelSubclass('Domain Entity', entityName, baseEntityName);
  }

  /**
   *
   */
  withEndDomainEntitySubclass(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  withStartInterchange(interchangeName: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Interchange', interchangeName);
  }

  withEndInterchange(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  withStartInterchangeExtension(identifier: string): MetaEdTextBuilder {
    return this.withStartTopLevelExtension('Interchange', identifier);
  }

  withEndInterchangeExtension(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  withAssociationIdentityTemplate(identityTemplateName: string): MetaEdTextBuilder {
    return this.withChildElement('association identity', identityTemplateName);
  }

  withDomainEntityIdentityTemplate(identityTemplateName: string): MetaEdTextBuilder {
    return this.withChildElement('domain entity identity', identityTemplateName);
  }

  withAssociationElement(entityName: string): MetaEdTextBuilder {
    return this.withChildElement('association', entityName);
  }

  withDescriptorElement(entityName: string): MetaEdTextBuilder {
    return this.withChildElement('descriptor', entityName);
  }

  withDomainEntityElement(entityName: string): MetaEdTextBuilder {
    return this.withChildElement('domain entity', entityName);
  }

  withStartDomain(domainName: string): MetaEdTextBuilder {
    return this.withStartTopLevel('Domain', domainName);
  }

  withEndDomain(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  withAssociationDomainItem(domainItemName: string): MetaEdTextBuilder {
    return this.withChildElement('association', domainItemName);
  }

  withCommonDomainItem(domainItemName: string): MetaEdTextBuilder {
    return this.withChildElement('common', domainItemName);
  }

  withInlineCommonDomainItem(domainItemName: string): MetaEdTextBuilder {
    return this.withChildElement('inline common', domainItemName);
  }

  withDescriptorDomainItem(domainItemName: string): MetaEdTextBuilder {
    return this.withChildElement('descriptor', domainItemName);
  }

  withDomainEntityDomainItem(domainItemName: string): MetaEdTextBuilder {
    return this.withChildElement('domain entity', domainItemName);
  }

  withStartSubdomain(subdomainName: string, parentDomainName: string): MetaEdTextBuilder {
    this.addLine(`Subdomain ${subdomainName} of ${parentDomainName}`);
    this.increaseIndentation();
    return this;
  }

  withSubdomainPosition(position: number): MetaEdTextBuilder {
    this.addLine(`position ${position}`);
    return this;
  }

  withEndSubdomain(): MetaEdTextBuilder {
    return this.withEndTopLevel();
  }

  withIdentityIndicator(): MetaEdTextBuilder {
    const identity = 'is part of identity';

    this.addLine(identity);
    return this;
  }

  withIdentityRenameIndicator(basePropertyIdentifier: string): MetaEdTextBuilder {
    const identityRename = 'renames identity property';

    this.addLine(`${identityRename} ${basePropertyIdentifier}`);
    return this;
  }

  withOptionalCollectionIndicator(): MetaEdTextBuilder {
    const optionalCollection = 'is optional collection';

    this.addLine(optionalCollection);
    return this;
  }

  withRequiredCollectionIndicator(): MetaEdTextBuilder {
    const requiredCollection = 'is required collection';

    this.addLine(requiredCollection);
    return this;
  }

  withOptionalPropertyIndicator(): MetaEdTextBuilder {
    const isOptional = 'is optional';

    this.addLine(isOptional);
    return this;
  }

  withRequiredPropertyIndicator(): MetaEdTextBuilder {
    const isRequired = 'is required';

    this.addLine(isRequired);
    return this;
  }

  withQueryableOnlyPropertyIndicator(): MetaEdTextBuilder {
    const isQueryableOnly = 'is queryable only';

    this.addLine(isQueryableOnly);
    return this;
  }

  withQueryableFieldPropertyIndicator(): MetaEdTextBuilder {
    const isQueryableField = 'is queryable field';

    this.addLine(isQueryableField);
    return this;
  }

  /**
   *
   */
  roleName(context: string | null, shortenTo: string | null = null): MetaEdTextBuilder {
    if (context == null) return this;

    const roleName = 'role name';
    if (shortenTo == null) {
      this.addLine(`${roleName} ${context}`);
    } else {
      this.addLine(`${roleName} ${context} shorten to ${shortenTo}`);
    }

    return this;
  }

  /**
   *
   */
  withMergeDirective(sourcePropertyPathStrings: string, targetPropertyPathStrings: string): MetaEdTextBuilder {
    this.addLine(`merge ${sourcePropertyPathStrings} with ${targetPropertyPathStrings}`);
    return this;
  }

  withStartProperty(propertyType: string, propertyIdentifier: string): MetaEdTextBuilder {
    this.addLine(`${propertyType} ${propertyIdentifier}`);
    this.increaseIndentation();
    return this;
  }

  withStartSharedProperty(propertyType: string, propertyIdentifier: string, named: string | null): MetaEdTextBuilder {
    if (named) {
      this.addLine(`shared ${propertyType} ${propertyIdentifier} named ${named}`);
    } else {
      this.addLine(`shared ${propertyType} ${propertyIdentifier}`);
    }

    this.increaseIndentation();
    return this;
  }

  withEndProperty(): MetaEdTextBuilder {
    this.decreaseIndentation();
    return this;
  }

  withProperty(
    propertyType: string,
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,

    shortenTo: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartProperty(propertyType, propertyIdentifier);
    if (deprecatedReason != null) this.withDeprecated(deprecatedReason);
    this.withPropertyElements(documentation, isRequired, isCollection, context, shortenTo);
    this.withEndProperty();
    return this;
  }

  withSharedProperty(
    propertyType: string,
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,

    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartSharedProperty(propertyType, propertyIdentifier, named);
    if (deprecatedReason != null) this.withDeprecated(deprecatedReason);
    this.withPropertyElements(documentation, isRequired, isCollection, context, null);
    this.withEndProperty();
    return this;
  }

  withIdentityProperty(
    propertyType: string,
    propertyIdentifier: string,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartProperty(propertyType, propertyIdentifier);

    this.withDocumentation(documentation);
    this.withIdentityIndicator();
    this.roleName(context);

    this.withEndProperty();
    return this;
  }

  withIdentityRenameProperty(
    propertyType: string,
    propertyIdentifier: string,
    basePropertyIdentifier: string,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartProperty(propertyType, propertyIdentifier);

    this.withDocumentation(documentation);
    this.withIdentityRenameIndicator(basePropertyIdentifier);
    this.roleName(context);

    this.withEndProperty();
    return this;
  }

  withPropertyElements(
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null,
    shortenTo: string | null,
  ): MetaEdTextBuilder {
    this.withDocumentation(documentation);

    if (isRequired && isCollection) {
      this.withRequiredCollectionIndicator();
    } else if (isRequired && !isCollection) {
      this.withRequiredPropertyIndicator();
    } else if (!isRequired && isCollection) {
      this.withOptionalCollectionIndicator();
    } else if (!isRequired && !isCollection) {
      this.withOptionalPropertyIndicator();
    }

    this.roleName(context, shortenTo);
    return this;
  }

  /**
   *
   */
  withAssociationDomainEntityProperty(
    identifier: string,
    documentation: string,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartProperty('domain entity', identifier);
    if (deprecatedReason != null) this.withDeprecated(deprecatedReason);
    this.withDocumentation(documentation);
    this.roleName(context);
    this.withEndProperty();
    return this;
  }

  /**
   *
   */
  withBooleanProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'bool',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withChoiceProperty(
    choiceName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    shortenTo: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'choice',
      choiceName,
      documentation,
      isRequired,
      isCollection,
      context,
      shortenTo,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withCommonProperty(
    commonName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    shortenTo: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'common',
      commonName,
      documentation,
      isRequired,
      isCollection,
      context,
      shortenTo,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withCommonExtensionOverrideProperty(
    commonTypeName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,

    shortenTo: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'common extension',
      commonTypeName,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      shortenTo,
    );
  }

  /**
   *
   */
  withDateProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'date',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withDatetimeProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'datetime',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withDescriptorProperty(
    descriptorName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'descriptor',
      descriptorName,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withDurationProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'duration',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withEnumerationProperty(
    enumerationName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'enumeration',
      enumerationName,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withInlineCommonProperty(
    inlineCommonName: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    shortenTo: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'inline common',
      inlineCommonName,
      documentation,
      isRequired,
      isCollection,
      context,
      shortenTo,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withPercentProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'percent',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withTimeProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'time',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withYearProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'year',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  withMinLength(minLength: string | null): MetaEdTextBuilder {
    if (minLength == null) return this;
    this.addLine(`min length ${minLength}`);
    return this;
  }

  withMaxLength(maxLength: string | null): MetaEdTextBuilder {
    if (maxLength == null) return this;
    this.addLine(`max length ${maxLength}`);
    return this;
  }

  withMinValue(minValue: string | null, bigHintMinValue: boolean = false): MetaEdTextBuilder {
    if (minValue != null) {
      this.addLine(`min value ${minValue}`);
    } else if (bigHintMinValue) {
      this.addLine('min value big');
    }
    return this;
  }

  withMaxValue(maxValue: string | null, bigHintMaxValue: boolean = false): MetaEdTextBuilder {
    if (maxValue != null) {
      this.addLine(`max value ${maxValue}`);
    } else if (bigHintMaxValue) {
      this.addLine('max value big');
    }
    return this;
  }

  withTotalDigits(totalDigits: string | null): MetaEdTextBuilder {
    if (totalDigits == null) return this;
    this.addLine(`total digits ${totalDigits}`);
    return this;
  }

  withDecimalPlaces(decimalPlaces: string | null): MetaEdTextBuilder {
    if (decimalPlaces == null) return this;
    this.addLine(`decimal places ${decimalPlaces}`);
    return this;
  }

  withIsWeakReference(isWeak: boolean = false): MetaEdTextBuilder {
    if (!isWeak) return this;
    this.addLine('is weak');
    return this;
  }

  withPotentiallyLogical(potentiallyLogical: boolean = false): MetaEdTextBuilder {
    if (!potentiallyLogical) return this;
    this.addLine('potentially logical');
    return this;
  }

  withStringRestrictions(minLength: string | null = null, maxLength: string | null = null): MetaEdTextBuilder {
    this.increaseIndentation();

    this.withMinLength(minLength);
    this.withMaxLength(maxLength);

    this.decreaseIndentation();

    return this;
  }

  withNumericRestrictions(
    minValue: string | null = null,
    maxValue: string | null = null,
    bigHintMinValue: boolean = false,
    bigHintMaxValue: boolean = false,
  ): MetaEdTextBuilder {
    this.increaseIndentation();

    this.withMinValue(minValue, bigHintMinValue);
    this.withMaxValue(maxValue, bigHintMaxValue);

    this.decreaseIndentation();

    return this;
  }

  withDecimalRestrictions(
    totalDigits: string,
    decimalPlaces: string,
    minValue: string | null = null,
    maxValue: string | null = null,
  ): MetaEdTextBuilder {
    this.increaseIndentation();
    this.withTotalDigits(totalDigits);
    this.withDecimalPlaces(decimalPlaces);
    this.decreaseIndentation();

    this.withNumericRestrictions(minValue, maxValue);

    return this;
  }

  withReferenceAdditions(isWeak: boolean = false, potentiallyLogical: boolean = false): MetaEdTextBuilder {
    this.increaseIndentation();
    this.withPotentiallyLogical(potentiallyLogical);
    this.withIsWeakReference(isWeak);
    this.decreaseIndentation();

    return this;
  }

  /**
   *
   */
  withStringProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    maxLength: string,
    minLength: string | null = null,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withProperty(
      'string',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.withStringRestrictions(minLength, maxLength);

    return this;
  }

  withStringPropertyAsQueryableField(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    maxLength: string,
    minLength: string | null = null,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withProperty(
      'string',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.addLine('is queryable field');
    this.withStringRestrictions(minLength, maxLength);
    return this;
  }

  /**
   *
   */
  withCurrencyProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withProperty(
      'currency',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withIntegerProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    maxValue: string | null = null,
    minValue: string | null = null,
    context: string | null = null,
    deprecatedReason: string | null = null,
    bigHintMinValue: boolean = false,
    bigHintMaxValue: boolean = false,
  ): MetaEdTextBuilder {
    this.withProperty(
      'integer',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.withNumericRestrictions(minValue, maxValue, bigHintMinValue, bigHintMaxValue);
    return this;
  }

  /**
   *
   */
  withShortProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    maxValue: string | null = null,
    minValue: string | null = null,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withProperty('short', propertyIdentifier, documentation, isRequired, isCollection, context, null, deprecatedReason);
    this.withNumericRestrictions(minValue, maxValue);
    return this;
  }

  /**
   *
   */
  withDecimalProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    totalDigits: string,
    decimalPlaces: string,
    minValue: string | null = null,
    maxValue: string | null = null,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    this.withProperty(
      'decimal',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
    return this;
  }

  /**
   *
   */
  withAssociationProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    isWeak: boolean = false,
    context: string | null = null,
    deprecatedReason: string | null = null,
    potentiallyLogical: boolean = false,
  ): MetaEdTextBuilder {
    this.withProperty(
      'association',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.withReferenceAdditions(isWeak, potentiallyLogical);
    return this;
  }

  /**
   *
   */
  withDomainEntityProperty(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    isWeak: boolean = false,
    context: string | null = null,
    deprecatedReason: string | null = null,
    potentiallyLogical: boolean = false,
  ): MetaEdTextBuilder {
    this.withProperty(
      'domain entity',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      null,
      deprecatedReason,
    );
    this.withReferenceAdditions(isWeak, potentiallyLogical);
    return this;
  }

  /**
   *
   */
  withDomainEntityPropertyWithShortenTo(
    propertyIdentifier: string,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    isWeak: boolean = false,
    context: string | null = null,
    shortenTo: string | null = null,
    deprecatedReason: string | null = null,
    potentiallyLogical: boolean = false,
  ): MetaEdTextBuilder {
    this.withProperty(
      'domain entity',
      propertyIdentifier,
      documentation,
      isRequired,
      isCollection,
      context,
      shortenTo,
      deprecatedReason,
    );
    this.withReferenceAdditions(isWeak, potentiallyLogical);
    return this;
  }

  withQueryableOnlyDomainEntityProperty(propertyIdentifier: string, documentation: string): MetaEdTextBuilder {
    this.withStartProperty('domain entity', propertyIdentifier);
    this.withDocumentation(documentation);
    this.withQueryableOnlyPropertyIndicator();
    this.withEndProperty();

    return this;
  }

  /**
   *
   */
  withSharedDecimalProperty(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withSharedProperty(
      'decimal',
      propertyIdentifier,
      named,
      documentation,
      isRequired,
      isCollection,
      context,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withSharedIntegerProperty(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withSharedProperty(
      'integer',
      propertyIdentifier,
      named,
      documentation,
      isRequired,
      isCollection,
      context,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withSharedShortProperty(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withSharedProperty(
      'short',
      propertyIdentifier,
      named,
      documentation,
      isRequired,
      isCollection,
      context,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withSharedStringProperty(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    isRequired: boolean,
    isCollection: boolean,
    context: string | null = null,
    deprecatedReason: string | null = null,
  ): MetaEdTextBuilder {
    return this.withSharedProperty(
      'string',
      propertyIdentifier,
      named,
      documentation,
      isRequired,
      isCollection,
      context,
      deprecatedReason,
    );
  }

  /**
   *
   */
  withSharedStringIdentity(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartSharedProperty('string', propertyIdentifier, named);
    this.withDocumentation(documentation);
    this.withIdentityIndicator();
    this.roleName(context);
    this.withEndProperty();
    return this;
  }

  /**
   *
   */
  withSharedIntegerIdentity(
    propertyIdentifier: string,
    named: string | null,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withStartSharedProperty('integer', propertyIdentifier, named);
    this.withDocumentation(documentation);
    this.withIdentityIndicator();
    this.roleName(context);
    this.withEndProperty();
    return this;
  }

  /**
   *
   */
  withBooleanIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('bool', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withDateIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('date', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withDatetimeIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('datetime', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withDurationIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('duration', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withEnumerationIdentity(
    propertyIdentifier: string,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    return this.withIdentityProperty('enumeration', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withTimeIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('time', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withYearIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('year', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withChoiceIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('choice', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withCommonIdentity(propertyIdentifier: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('common', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withDomainEntityIdentity(
    propertyIdentifier: string,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    return this.withIdentityProperty('domain entity', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withAssociationIdentity(
    propertyIdentifier: string,
    documentation: string,
    context: string | null = null,
  ): MetaEdTextBuilder {
    return this.withIdentityProperty('association', propertyIdentifier, documentation, context);
  }

  /**
   *
   */
  withStringIdentity(
    propertyIdentifier: string,
    documentation: string,
    maxLength: string,
    minLength: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityProperty('string', propertyIdentifier, documentation, context);
    this.withStringRestrictions(minLength, maxLength);
    return this;
  }

  /**
   *
   */
  withIntegerIdentity(
    propertyIdentifier: string,
    documentation: string,
    maxValue: string | null = null,
    minValue: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityProperty('integer', propertyIdentifier, documentation, context);
    this.withNumericRestrictions(minValue, maxValue);
    return this;
  }

  /**
   *
   */
  withShortIdentity(
    propertyIdentifier: string,
    documentation: string,
    maxValue: string | null = null,
    minValue: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityProperty('short', propertyIdentifier, documentation, context);
    this.withNumericRestrictions(minValue, maxValue);
    return this;
  }

  /**
   *
   */
  withDecimalIdentity(
    propertyIdentifier: string,
    documentation: string,
    totalDigits: string,
    decimalPlaces: string,
    minValue: string | null = null,
    maxValue: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityProperty('decimal', propertyIdentifier, documentation, context);
    this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
    return this;
  }

  /**
   *
   */
  withDescriptorIdentity(descriptorName: string, documentation: string, context: string | null = null): MetaEdTextBuilder {
    return this.withIdentityProperty('descriptor', descriptorName, documentation, context);
  }

  /**
   *
   */
  withStringIdentityRename(
    propertyIdentifier: string,
    basePropertyIdentifier: string,
    documentation: string,
    maxLength: string,
    minLength: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityRenameProperty('string', propertyIdentifier, basePropertyIdentifier, documentation, context);
    this.withStringRestrictions(minLength, maxLength);
    return this;
  }

  /**
   *
   */
  withIntegerIdentityRename(
    propertyIdentifier: string,
    basePropertyIdentifier: string,
    documentation: string,
    maxValue: string | null = null,
    minValue: string | null = null,
    context: string | null = null,
  ): MetaEdTextBuilder {
    this.withIdentityRenameProperty('integer', propertyIdentifier, basePropertyIdentifier, documentation, context);
    this.withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withEnumerationItem(shortDescription: string, documentation: string | null = null): MetaEdTextBuilder {
    this.withStartProperty('item', `"${shortDescription}"`);
    if (documentation != null) {
      this.withDocumentation(documentation);
    }
    this.withEndProperty();
    return this;
  }
}
