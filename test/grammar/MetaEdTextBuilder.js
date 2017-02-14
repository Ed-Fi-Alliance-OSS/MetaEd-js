// @flow

export default class MetaEdTextBuilder {
  textLines: string[];
  indentationLevel: number;

  constructor() {
    this.textLines = [];
    this.indentationLevel = 0;
  }

  static build() {
    return new MetaEdTextBuilder();
  }

  toString(): string {
    return this.textLines.join('\r\n');
  }

  _getIndentation(): string {
    return ' '.repeat(this.indentationLevel * 2);
  }

  _increaseIndentation() {
    this.indentationLevel += 1;
  }

  _decreaseIndentation() {
    this.indentationLevel -= 1;
  }

  _addLineWithoutIndentation(line: string) {
    this.textLines.push(line);
  }

  _addLine(line: string) {
    const indention = this._getIndentation();
    this.textLines.push(indention + line);
  }

  withBlankLine(): MetaEdTextBuilder {
    this._addLineWithoutIndentation('');
    return this;
  }

  withTrailingText(text: string): MetaEdTextBuilder {
    const idx = this.textLines.length - 1;
    this.textLines[idx] = this.textLines[idx] + text;
    return this;
  }

  withBeginNamespace(identifier: string, projectExtension: ?string = null): MetaEdTextBuilder {
    if (projectExtension == null) {
      this._addLine(`Begin Namespace ${identifier} core`);
    } else {
      this._addLine(`Begin Namespace ${identifier} ${projectExtension}`);
    }
    this._increaseIndentation();
    return this;
  }

  withEndNamespace(): MetaEdTextBuilder {
    this._decreaseIndentation();
    this._addLine('End Namespace');
    return this;
  }

  withComment(comment: string): MetaEdTextBuilder {
    this._addLine(`//${comment}`);
    return this;
  }

  withDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'documentation';
    this._addLine(documentationToken);
    return this._withDocumentationLine(documentation);
  }

  withExtendedDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'extended documentation';
    this._addLine(documentationToken);
    return this._withDocumentationLine(documentation);
  }

  withUseCaseDocumentation(documentation: string): MetaEdTextBuilder {
    const documentationToken = 'use case documentation';
    this._addLine(documentationToken);
    return this._withDocumentationLine(documentation);
  }

  _withDocumentationLine(documentation: string): MetaEdTextBuilder {
    this._addLine(`"${documentation}"`);
    return this;
  }

  withMetaEdId(metaEdId: ?string): MetaEdTextBuilder {
    if (metaEdId == null) return this;
    if (this.textLines.length > 0) {
      const lastLine = this.textLines[this.textLines.length - 1];
      this.textLines[this.textLines.length - 1] = `${lastLine} [${metaEdId}]`;
    } else {
      this._addLine(`[${metaEdId}]`);
    }
    return this;
  }

  _withChildElement(elementType: string, identifier: string, metaEdId: ?string = null): MetaEdTextBuilder {
    this._addLine(`${elementType} ${identifier}`);
    this.withMetaEdId(metaEdId);
    return this;
  }

  _withStartTopLevel(keyword: string, identifier: string, baseIdentifier: ?string = null): MetaEdTextBuilder {
    if (baseIdentifier == null) {
      this._addLine(`${keyword} ${identifier}`);
    } else {
      this._addLine(`${keyword} ${identifier} based on ${baseIdentifier}`);
    }
    this._increaseIndentation();
    return this;
  }

  _withStartTopLevelExtension(keyword: string, identifier: string): MetaEdTextBuilder {
    this._addLine(`${keyword} ${identifier} additions`);
    this._increaseIndentation();
    return this;
  }

  _withEndTopLevel(): MetaEdTextBuilder {
    this._decreaseIndentation();
    return this;
  }

  withCascadeUpdate(): MetaEdTextBuilder {
    this._addLine('allow primary key updates');
    return this;
  }

  withStartMapType(isRequired: boolean = true): MetaEdTextBuilder {
    this._addLine(isRequired ? 'with map type' : 'with optional map type');
    this._increaseIndentation();
    return this;
  }

  withEndMapType(): MetaEdTextBuilder {
    this._decreaseIndentation();
    return this;
  }

  withStartEnumeration(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Enumeration', identifier);
  }

  withEndEnumeration(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartDescriptor(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Descriptor', identifier);
  }

  withEndDescriptor(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartDomainEntity(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Domain Entity', identifier);
  }

  withEndDomainEntity(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartAssociationExtension(extensionName: string): MetaEdTextBuilder {
    return this._withStartTopLevelExtension('Association', extensionName);
  }

  withEndAssociationExtension(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartDomainEntityExtension(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevelExtension('Domain Entity', identifier);
  }

  withEndDomainEntityExtension(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartAbstractEntity(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Abstract Entity', identifier);
  }

  withEndAbstractEntity(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartChoice(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Choice', identifier);
  }

  withEndChoice(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartSharedDecimal(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Shared Decimal', identifier);
  }

  withEndSharedDecimal(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartSharedInteger(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Shared Integer', identifier);
  }

  withEndSharedInteger(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartSharedShort(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Shared Short', identifier);
  }

  withEndSharedShort(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartSharedString(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Shared String', identifier);
  }

  withEndSharedString(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartCommon(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Common', identifier);
  }

  withEndCommon(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartCommonExtension(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevelExtension('Common', identifier);
  }

  withEndCommonExtension(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartInlineCommon(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Inline Common', identifier);
  }

  withEndInlineCommon(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartAssociation(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Association', identifier);
  }

  withEndAssociation(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartAssociationSubclass(associationName: string, baseAssociationName: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Association', associationName, baseAssociationName);
  }

  withEndAssociationSubclass(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartDomainEntitySubclass(entityName: string, baseEntityName: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Domain Entity', entityName, baseEntityName);
  }

  withEndDomainEntitySubclass(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartInterchange(interchangeName: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Interchange', interchangeName);
  }

  withEndInterchange(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withStartInterchangeExtension(identifier: string): MetaEdTextBuilder {
    return this._withStartTopLevelExtension('Interchange', identifier);
  }

  withEndInterchangeExtension(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withAssociationIdentityTemplate(identityTemplateName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('association identity', identityTemplateName, metaEdId);
  }

  withDomainEntityIdentityTemplate(identityTemplateName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('domain entity identity', identityTemplateName, metaEdId);
  }

  withAssociationElement(entityName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('association', entityName, metaEdId);
  }

  withDescriptorElement(entityName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('descriptor', entityName, metaEdId);
  }

  withDomainEntityElement(entityName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('domain entity', entityName, metaEdId);
  }

  withStartDomain(domainName: string): MetaEdTextBuilder {
    return this._withStartTopLevel('Domain', domainName);
  }

  withEndDomain(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withAssociationDomainItem(domainItemName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('association', domainItemName, metaEdId);
  }

  withCommonDomainItem(domainItemName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('common', domainItemName, metaEdId);
  }

  withDescriptorDomainItem(domainItemName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('descriptor', domainItemName, metaEdId);
  }

  withDomainEntityDomainItem(domainItemName: string, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withChildElement('domain entity', domainItemName, metaEdId);
  }

  withStartSubdomain(subdomainName: string, parentDomainName: string): MetaEdTextBuilder {
    this._addLine(`Subdomain ${subdomainName} of ${parentDomainName}`);
    this._increaseIndentation();
    return this;
  }

  withEndSubdomain(): MetaEdTextBuilder {
    return this._withEndTopLevel();
  }

  withIdentityIndicator(): MetaEdTextBuilder {
    const identity = 'is part of identity';

    this._addLine(identity);
    return this;
  }

  withIdentityRenameIndicator(basePropertyIdentifier: string): MetaEdTextBuilder {
    const identityRename = 'renames identity property';

    this._addLine(`${identityRename} ${basePropertyIdentifier}`);
    return this;
  }

  withOptionalCollectionIndicator(): MetaEdTextBuilder {
    const optionalCollection = 'is optional collection';

    this._addLine(optionalCollection);
    return this;
  }

  withRequiredCollectionIndicator(): MetaEdTextBuilder {
    const requiredCollection = 'is required collection';

    this._addLine(requiredCollection);
    return this;
  }

  withOptionalPropertyIndicator(): MetaEdTextBuilder {
    const isOptional = 'is optional';

    this._addLine(isOptional);
    return this;
  }

  withRequiredPropertyIndicator(): MetaEdTextBuilder {
    const isRequired = 'is required';

    this._addLine(isRequired);
    return this;
  }

  withContext(context: ?string, shortenTo: ?string = null): MetaEdTextBuilder {
    if (context == null) return this;

    const withContext = 'with context';
    if (shortenTo == null) {
      this._addLine(`${withContext} ${context}`);
    } else {
      this._addLine(`${withContext} ${context} shorten to ${shortenTo}`);
    }

    return this;
  }

  withMergePartOfReference(mergePropertyPath: string, targetPropertyPath: string): MetaEdTextBuilder {
    this._addLine(`merge ${mergePropertyPath} with ${targetPropertyPath}`);
    return this;
  }

  _withStartProperty(propertyType: string, propertyIdentifier: string, metaEdId: ?string = null): MetaEdTextBuilder {
    this._addLine(`${propertyType} ${propertyIdentifier}`);
    this.withMetaEdId(metaEdId);
    this._increaseIndentation();
    return this;
  }

  _withStartSharedProperty(propertyType: string, propertyIdentifier: string, named: string, metaEdId: ?string = null): MetaEdTextBuilder {
    if (named) {
      this._addLine(`shared ${propertyType} ${propertyIdentifier} named ${named}`);
    } else {
      this._addLine(`shared ${propertyType} ${propertyIdentifier}`);
    }

    this.withMetaEdId(metaEdId);
    this._increaseIndentation();
    return this;
  }

  _withEndProperty(): MetaEdTextBuilder {
    this._decreaseIndentation();
    return this;
  }

  _withProperty(propertyType: string, propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartProperty(propertyType, propertyIdentifier, metaEdId);
    this._withPropertyElements(documentation, isRequired, isCollection, context);
    this._withEndProperty();
    return this;
  }

  _withSharedProperty(propertyType: string, propertyIdentifier: string, named: string, documentation: string, isRequired: boolean,
    isCollection: boolean, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartSharedProperty(propertyType, propertyIdentifier, named, metaEdId);
    this._withPropertyElements(documentation, isRequired, isCollection, context);
    this._withEndProperty();
    return this;
  }

  _withIdentityProperty(propertyType: string, propertyIdentifier: string, documentation: string,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartProperty(propertyType, propertyIdentifier, metaEdId);

    this.withDocumentation(documentation);
    this.withIdentityIndicator();
    this.withContext(context);

    this._withEndProperty();
    return this;
  }

  _withIdentityRenameProperty(propertyType: string, propertyIdentifier: string, basePropertyIdentifier: string,
    documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartProperty(propertyType, propertyIdentifier, metaEdId);

    this.withDocumentation(documentation);
    this.withIdentityRenameIndicator(basePropertyIdentifier);
    this.withContext(context);

    this._withEndProperty();
    return this;
  }

  _withPropertyElements(documentation: string, isRequired: boolean, isCollection: boolean, context: ?string): MetaEdTextBuilder {
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

    this.withContext(context);
    return this;
  }

  withBooleanProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('bool', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withDateProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('date', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withDurationProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('duration', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withPercentProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('percent', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withTimeProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('time', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withYearProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('year', propertyIdentifier, documentation, isRequired, isCollection,
      context, metaEdId);
  }

  withAssociationDomainEntityProperty(identifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartProperty('domain entity', identifier, metaEdId);
    this.withDocumentation(documentation);
    this.withContext(context);
    this._withEndProperty();
    return this;
  }

  withDescriptorProperty(descriptorName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('descriptor', descriptorName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withEnumerationProperty(enumerationName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('enumeration', enumerationName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withChoiceProperty(choiceName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('choice', choiceName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withCommonProperty(commonName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('common', commonName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withCommonExtensionOverrideProperty(commonTypeName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('common extension', commonTypeName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withInlineCommonProperty(inlineCommonName: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('inline common', inlineCommonName, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withMinLength(minLength: ?number): MetaEdTextBuilder {
    if (minLength == null) return this;
    this._addLine(`min length ${minLength}`);
    return this;
  }

  withMaxLength(maxLength: ?number): MetaEdTextBuilder {
    if (maxLength == null) return this;
    this._addLine(`max length ${maxLength}`);
    return this;
  }

  withMinValue(minValue: ?number): MetaEdTextBuilder {
    if (minValue == null) return this;
    this._addLine(`min value ${minValue}`);
    return this;
  }

  withMaxValue(maxValue: ?number): MetaEdTextBuilder {
    if (maxValue == null) return this;
    this._addLine(`max value ${maxValue}`);
    return this;
  }

  withTotalDigits(totalDigits: ?number): MetaEdTextBuilder {
    if (totalDigits == null) return this;
    this._addLine(`total digits ${totalDigits}`);
    return this;
  }

  withDecimalPlaces(decimalPlaces: ?number): MetaEdTextBuilder {
    if (decimalPlaces == null) return this;
    this._addLine(`decimal places ${decimalPlaces}`);
    return this;
  }

  withIsWeakReference(isWeak: boolean = false): MetaEdTextBuilder {
    if (!isWeak) return this;
    this._addLine('is weak');
    return this;
  }

  _withStringRestrictions(minLength: ?number = null, maxLength: ?number = null): MetaEdTextBuilder {
    this._increaseIndentation();

    this.withMinLength(minLength);
    this.withMaxLength(maxLength);

    this._decreaseIndentation();

    return this;
  }

  _withNumericRestrictions(minValue: ?number = null, maxValue: ?number = null): MetaEdTextBuilder {
    this._increaseIndentation();

    this.withMinValue(minValue);
    this.withMaxValue(maxValue);

    this._decreaseIndentation();

    return this;
  }

  _withDecimalRestrictions(totalDigits: number, decimalPlaces: number, minValue: ?number = null, maxValue: ?number = null): MetaEdTextBuilder {
    this._increaseIndentation();
    this.withTotalDigits(totalDigits);
    this.withDecimalPlaces(decimalPlaces);
    this._decreaseIndentation();

    this._withNumericRestrictions(minValue, maxValue);

    return this;
  }

  _withReferenceAdditions(isWeak: boolean = false): MetaEdTextBuilder {
    this._increaseIndentation();
    this.withIsWeakReference(isWeak);
    this._decreaseIndentation();

    return this;
  }

  withStringProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    maxLength: number, minLength: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('string', propertyIdentifier, documentation, isRequired, isCollection,
      context, metaEdId);
    this._withStringRestrictions(minLength, maxLength);

    return this;
  }

  withCurrencyProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withProperty('currency', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
  }

  withIntegerProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    maxValue: ?number = null, minValue: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('integer', propertyIdentifier, documentation, isRequired, isCollection,
      context, metaEdId);
    this._withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withShortProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    maxValue: ?number = null, minValue: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('short', propertyIdentifier, documentation, isRequired, isCollection,
      context, metaEdId);
    this._withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withDecimalProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean, totalDigits: number,
    decimalPlaces: number, minValue: ?number = null, maxValue: ?number = null,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('decimal', propertyIdentifier, documentation, isRequired, isCollection,
      context, metaEdId);
    this._withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
    return this;
  }


  withAssociationProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    isWeak: boolean = false, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('association', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
    this._withReferenceAdditions(isWeak);
    return this;
  }

  withDomainEntityProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
    isWeak: boolean = false, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withProperty('domain entity', propertyIdentifier, documentation, isRequired,
      isCollection, context, metaEdId);
    this._withReferenceAdditions(isWeak);
    return this;
  }

  withSharedDecimalProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withSharedProperty('decimal', propertyIdentifier, named, documentation,
      isRequired, isCollection, context, metaEdId);
  }

  withSharedIntegerProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withSharedProperty('integer', propertyIdentifier, named, documentation,
      isRequired, isCollection, context, metaEdId);
  }

  withSharedShortProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withSharedProperty('short', propertyIdentifier, named, documentation,
      isRequired, isCollection, context, metaEdId);
  }

  withSharedStringProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withSharedProperty('string', propertyIdentifier, named, documentation,
      isRequired, isCollection, context, metaEdId);
  }

  withBooleanIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('bool', propertyIdentifier, documentation, context, metaEdId);
  }

  withDateIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('date', propertyIdentifier, documentation, context, metaEdId);
  }

  withDurationIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('duration', propertyIdentifier, documentation,
      context, metaEdId);
  }

  withTimeIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('time', propertyIdentifier, documentation, context, metaEdId);
  }

  withYearIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('year', propertyIdentifier, documentation, context, metaEdId);
  }

  withChoiceIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('choice', propertyIdentifier, documentation, context, metaEdId);
  }

  withCommonIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('common', propertyIdentifier, documentation, context, metaEdId);
  }

  withDomainEntityIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('domain entity', propertyIdentifier, documentation, context, metaEdId);
  }

  withStringIdentity(propertyIdentifier: string, documentation: string, maxLength: number, minLength: ?number = null,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityProperty('string', propertyIdentifier, documentation, context, metaEdId);
    this._withStringRestrictions(minLength, maxLength);
    return this;
  }

  withIntegerIdentity(propertyIdentifier: string, documentation: string, maxValue: ?number = null, minValue: ?number = null,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityProperty('integer', propertyIdentifier, documentation, context, metaEdId);
    this._withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withShortIdentity(propertyIdentifier: string, documentation: string, maxValue: ?number = null, minValue: ?number = null,
    context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityProperty('short', propertyIdentifier, documentation, context, metaEdId);
    this._withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withDecimalIdentity(propertyIdentifier: string, documentation: string, totalDigits: number, decimalPlaces: number,
    minValue: ?number = null, maxValue: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityProperty('decimal', propertyIdentifier, documentation, context, metaEdId);
    this._withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
    return this;
  }

  withEnumerationIdentity(propertyIdentifier: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('enumeration', propertyIdentifier, documentation,
      context, metaEdId);
  }

  withDescriptorIdentity(descriptorName: string, documentation: string, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    return this._withIdentityProperty('descriptor', descriptorName, documentation,
      context, metaEdId);
  }

  withStringIdentityRename(propertyIdentifier: string, basePropertyIdentifier: string, documentation: string,
    maxLength: number, minLength: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityRenameProperty('string', propertyIdentifier, basePropertyIdentifier,
      documentation, context, metaEdId);
    this._withStringRestrictions(minLength, maxLength);
    return this;
  }

  withIntegerIdentityRename(propertyIdentifier: string, basePropertyIdentifier: string, documentation: string,
    maxValue: ?number = null, minValue: ?number = null, context: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withIdentityRenameProperty('integer', propertyIdentifier, basePropertyIdentifier,
      documentation, context, metaEdId);
    this._withNumericRestrictions(minValue, maxValue);
    return this;
  }

  withEnumerationItem(shortDescription: string, documentation: ?string = null, metaEdId: ?string = null): MetaEdTextBuilder {
    this._withStartProperty('item', `"${shortDescription}"`, metaEdId);
    if (documentation != null) {
      this.withDocumentation(documentation);
    }
    this._withEndProperty();
    return this;
  }
}

