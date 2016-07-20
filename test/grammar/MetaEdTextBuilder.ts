import StringHelper from '../../src/common/StringHelper';

export default class MetaEdTextBuilder {
    private textLines: Array<string>;
    private indentationLevel: number;

    constructor() {
        this.textLines = [];
        this.indentationLevel = 0;
    }

    toString(): string {
        return this.textLines.join('\r\n');
    }

    private getIndentation(): string {
        return ' '.repeat(this.indentationLevel * 2);
    }

    private increaseIndentation() {
        this.indentationLevel += 1;
    }

    private decreaseIndentation() {
        this.indentationLevel -= 1;
    }

    private addLineWithoutIndentation(line: string, ...parameters: string[]) {
        this.textLines.push(StringHelper.format(line, ...parameters));
    }

    private addLine(line: string, ...parameters: string[]) {
        const indention = this.getIndentation();
        this.textLines.push(indention + StringHelper.format(line, ...parameters));
    }

    withBlankLine() {
        this.addLineWithoutIndentation('');
        return this;
    }

    withTrailingText(text: string) {
        const idx = this.textLines.length - 1;
        this.textLines[idx] = this.textLines[idx] + text;
        return this;
    }

    withBeginNamespace(identifier: string, projectExtension: string = null) {
        if (projectExtension == null) {
            this.addLine('Begin Namespace {0} core', identifier);
        } else {
            this.addLine('Begin Namespace {0} {1}', identifier, projectExtension);
        }
        this.increaseIndentation();
        return this;
    }

    withEndNamespace() {
        this.decreaseIndentation();
        this.addLine('End Namespace');
        return this;
    }

    withComment(comment: string) {
        this.addLine('//{0}', comment);
        return this;
    }

    withDocumentation(...documentationLines: string[]) {
        const documentation = 'documentation';
        this.addLine(documentation);
        return this.withDocumentationLines(...documentationLines);
    }

    withExtendedDocumentation(...documentationLines: string[]) {
        const extendedDocumentation = 'extended documentation';
        this.addLine(extendedDocumentation);
        return this.withDocumentationLines(...documentationLines);
    }

    withUseCaseDocumentation(...documentationLines: string[]) {
        const useCaseDocumentation = 'use case documentation';
        this.addLine(useCaseDocumentation);
        return this.withDocumentationLines(...documentationLines);
    }

    private withDocumentationLines(...documentationLines: string[]) {
        const documentationPrefix = '\'';
        for (const line of documentationLines) {
            this.addLine('{0}{1}', documentationPrefix, line);
        }
        return this;
    }

    withMetaEdId(metaEdId: string) {
        if (metaEdId == null) return this;
        if (this.textLines.length > 0) {
            const lastLine = this.textLines[this.textLines.length - 1];
            this.textLines[this.textLines.length - 1] =
                StringHelper.format('{0} [{1}]', lastLine, metaEdId);
        } else {
            this.addLine('[{0}]', metaEdId);
        }
        return this;
    }

    private withChildElement(elementType: string, identifier: string, metaEdId: string = null) {
        this.addLine('{0} {1}', elementType, identifier);
        this.withMetaEdId(metaEdId);
        return this;
    }

    private withStartTopLevel(keyword: string, identifier: string, baseIdentifier: string = null) {
        if (baseIdentifier == null) {
            this.addLine('{0} {1}', keyword, identifier);
        } else {
            this.addLine('{0} {1} based on {2}', keyword, identifier, baseIdentifier);
        }
        this.increaseIndentation();
        return this;
    }

    private withStartTopLevelExtension(keyword: string, identifier: string) {
        this.addLine('{0} {1} additions', keyword, identifier);
        this.increaseIndentation();
        return this;
    }

    private withEndTopLevel() {
        this.decreaseIndentation();
        return this;
    }

    withCascadeUpdate() {
        this.addLine('allow primary key updates');
        return this;
    }

    withStartMapType(isRequired: boolean = true) {
        this.addLine(isRequired ? 'with map type' : 'with optional map type');
        this.increaseIndentation();
        return this;
    }

    withEndMapType() {
        this.decreaseIndentation();
        return this;
    }

    withStartEnumeration(identifier: string) {
        return this.withStartTopLevel('Enumeration', identifier);
    }

    withEndEnumeration() {
        return this.withEndTopLevel();
    }

    withStartDescriptor(identifier: string) {
        return this.withStartTopLevel('Descriptor', identifier);
    }

    withEndDescriptor() {
        return this.withEndTopLevel();
    }

    withStartDomainEntity(identifier: string) {
        return this.withStartTopLevel('Domain Entity', identifier);
    }

    withEndDomainEntity() {
        return this.withEndTopLevel();
    }

    withStartAssociationExtension(extensionName: string) {
        return this.withStartTopLevelExtension('Association', extensionName);
    }

    withEndAssociationExtension() {
        return this.withEndTopLevel();
    }

    withStartDomainEntityExtension(identifier: string) {
        return this.withStartTopLevelExtension('Domain Entity', identifier);
    }

    withEndDomainEntityExtension() {
        return this.withEndTopLevel();
    }

    withStartAbstractEntity(identifier: string) {
        return this.withStartTopLevel('Abstract Entity', identifier);
    }

    withEndAbstractEntity() {
        return this.withEndTopLevel();
    }

    withStartChoiceType(identifier: string) {
        return this.withStartTopLevel('Choice Common Type', identifier);
    }

    withEndChoiceType() {
        return this.withEndTopLevel();
    }

    withStartCommonDecimal(identifier: string) {
        return this.withStartTopLevel('Common Decimal', identifier);
    }

    withEndCommonDecimal() {
        return this.withEndTopLevel();
    }

    withStartCommonInteger(identifier: string) {
        return this.withStartTopLevel('Common Integer', identifier);
    }

    withEndCommonInteger() {
        return this.withEndTopLevel();
    }

    withStartCommonShort(identifier: string) {
        return this.withStartTopLevel('Common Short', identifier);
    }

    withEndCommonShort() {
        return this.withEndTopLevel();
    }

    withStartCommonString(identifier: string) {
        return this.withStartTopLevel('Common String', identifier);
    }

    withEndCommonString() {
        return this.withEndTopLevel();
    }

    withStartCommonType(identifier: string) {
        return this.withStartTopLevel('Common Type', identifier);
    }

    withEndCommonType() {
        return this.withEndTopLevel();
    }

    withStartCommonTypeExtension(identifier: string) {
        return this.withStartTopLevelExtension('Common Type', identifier);
    }

    withEndCommonTypeExtension() {
        return this.withEndTopLevel();
    }

    withStartInlineCommonType(identifier: string) {
        return this.withStartTopLevel('Inline Common Type', identifier);
    }

    withEndInlineCommonType() {
        return this.withEndTopLevel();
    }

    withStartAssociation(identifier: string) {
        return this.withStartTopLevel('Association', identifier);
    }

    withEndAssociation() {
        return this.withEndTopLevel();
    }

    withStartAssociationSubclass(associationName: string, baseAssociationName: string) {
        return this.withStartTopLevel('Association', associationName, baseAssociationName);
    }

    withEndAssociationSubclass() {
        return this.withEndTopLevel();
    }

    withStartDomainEntitySubclass(entityName: string, baseEntityName: string) {
        return this.withStartTopLevel('Domain Entity', entityName, baseEntityName);
    }

    withEndDomainEntitySubclass() {
        return this.withEndTopLevel();
    }

    withStartInterchange(interchangeName: string) {
        return this.withStartTopLevel('Interchange', interchangeName);
    }

    withEndInterchange() {
        return this.withEndTopLevel();
    }

    withStartInterchangeExtension(identifier: string) {
        return this.withStartTopLevelExtension('Interchange', identifier);
    }

    withEndInterchangeExtension() {
        return this.withEndTopLevel();
    }

    withElement(domainEntityName: string, metaEdId: string = null) {
        return this.withChildElement('element', domainEntityName, metaEdId);
    }

    withIdentityTemplate(identityTemplateName: string, metaEdId: string = null) {
        return this.withChildElement('identity template', identityTemplateName, metaEdId);
    }

    withStartDomain(domainName: string) {
        return this.withStartTopLevel('Domain', domainName);
    }

    withEndDomain() {
        return this.withEndTopLevel();
    }

    withStartSubdomain(subdomainName: string, parentDomainName: string) {
        this.addLine('Subdomain {0} of {1}', subdomainName, parentDomainName);
        this.increaseIndentation();
        return this;
    }

    withEndSubdomain() {
        return this.withEndTopLevel();
    }

    withDomainItem(domainItemName: string, metaEdId: string = null) {
        return this.withChildElement('domain item', domainItemName, metaEdId);
    }

    withIdentityIndicator() {
        const identity = 'is part of identity';

        this.addLine(identity);
        return this;
    }

    withIdentityRenameIndicator(basePropertyIdentifier: string) {
        const identityRename = 'renames identity property';

        this.addLine('{0} {1}', identityRename, basePropertyIdentifier);
        return this;
    }

    withOptionalCollectionIndicator() {
        const optionalCollection = 'is optional collection';

        this.addLine(optionalCollection);
        return this;
    }

    withRequiredCollectionIndicator() {
        const requiredCollection = 'is required collection';

        this.addLine(requiredCollection);
        return this;
    }

    withOptionalPropertyIndicator() {
        const isOptional = 'is optional';

        this.addLine(isOptional);
        return this;
    }

    withRequiredPropertyIndicator() {
        const isRequired = 'is required';

        this.addLine(isRequired);
        return this;
    }

    withContext(context: string, shortenTo: string = null) {
        if (context == null) return this;

        const withContext = 'with context';
        if (shortenTo == null) {
            this.addLine('{0} {1}', withContext, context);
        } else {
            this.addLine('{0} {1} shorten to {2}', withContext, context, shortenTo);
        }

        return this;
    }

    withMergePartOfReference(mergePropertyPath: string, targetPropertyPath: string) {
        this.addLine('merge {0} with {1}', mergePropertyPath, targetPropertyPath);
        return this;
    }

    private withStartProperty(propertyType: string, propertyIdentifier: string, metaEdId: string = null) {
        this.addLine('{0} {1}', propertyType, propertyIdentifier);
        this.withMetaEdId(metaEdId);
        this.increaseIndentation();
        return this;
    }

    private withStartSharedProperty(propertyType: string, propertyIdentifier: string, named: string, metaEdId: string = null) {
        this.addLine('shared {0} {1} named {2}', propertyType, propertyIdentifier, named);
        this.withMetaEdId(metaEdId);
        this.increaseIndentation();
        return this;
    }

    private withEndProperty() {
        this.decreaseIndentation();
        return this;
    }

    private withProperty(propertyType: string, propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                 context: string = null, metaEdId: string = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);
        this.withPropertyElements(documentation, isRequired, isCollection, context);
        this.withEndProperty();
        return this;
    }

    private withSharedProperty(propertyType: string, propertyIdentifier: string, named: string, documentation: string, isRequired: boolean,
                       isCollection: boolean, context: string = null, metaEdId: string = null) {
        this.withStartSharedProperty(propertyType, propertyIdentifier, named, metaEdId);
        this.withPropertyElements(documentation, isRequired, isCollection, context);
        this.withEndProperty();
        return this;
    }

    private withIdentityProperty(propertyType: string, propertyIdentifier: string, documentation: string,
                         context: string = null, metaEdId: string = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);

        this.withDocumentation(documentation);
        this.withIdentityIndicator();
        this.withContext(context);

        this.withEndProperty();
        return this;
    }

    private withIdentityRenameProperty(propertyType: string, propertyIdentifier: string, basePropertyIdentifier: string,
                               documentation: string, context: string = null, metaEdId: string = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);

        this.withDocumentation(documentation);
        this.withIdentityRenameIndicator(basePropertyIdentifier);
        this.withContext(context);

        this.withEndProperty();
        return this;
    }

    private withPropertyElements(documentation: string, isRequired: boolean, isCollection: boolean, context: string) {
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
                        context: string = null, metaEdId: string = null) {
        return this.withProperty('bool', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withDateProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                     context: string = null, metaEdId: string = null) {
        return this.withProperty('date', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withDurationProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                         context: string = null, metaEdId: string = null) {
        return this.withProperty('duration', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withPercentProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                        context: string = null, metaEdId: string = null) {
        return this.withProperty('percent', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withTimeProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                     context: string = null, metaEdId: string = null) {
        return this.withProperty('time', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withYearProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                     context: string = null, metaEdId: string = null) {
        return this.withProperty('year', propertyIdentifier, documentation, isRequired, isCollection,
            context, metaEdId);
    }

    withDomainEntityProperty(identifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        this.withStartProperty('domain entity', identifier, metaEdId);
        this.withDocumentation(documentation);
        this.withContext(context);
        this.withEndProperty();
        return this;
    }

    withDescriptorProperty(descriptorName: string, documentation: string, isRequired: boolean, isCollection: boolean,
                           context: string = null, metaEdId: string = null) {
        return this.withProperty('descriptor', descriptorName, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withEnumerationProperty(enumerationName: string, documentation: string, isRequired: boolean, isCollection: boolean,
                            context: string = null, metaEdId: string = null) {
        return this.withProperty('enumeration', enumerationName, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withIncludeProperty(commonTypeName: string, documentation: string, isRequired: boolean, isCollection: boolean,
                        context: string = null, metaEdId: string = null) {
        return this.withProperty('include', commonTypeName, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withIncludeExtensionOverrideProperty(commonTypeName: string, documentation: string, isRequired: boolean, isCollection: boolean,
                                         context: string = null, metaEdId: string = null) {
        return this.withProperty('include extension', commonTypeName, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withMinLength(minLength: number) {
        if (minLength == null) return this;
        this.addLine('min length {0}', minLength.toString());
        return this;
    }

    withMaxLength(maxLength: number) {
        if (maxLength == null) return this;
        this.addLine('max length {0}', maxLength.toString());
        return this;
    }

    withMinValue(minValue: number) {
        if (minValue == null) return this;
        this.addLine('min value {0}', minValue.toString());
        return this;
    }

    withMaxValue(maxValue: number) {
        if (maxValue == null) return this;
        this.addLine('max value {0}', maxValue.toString());
        return this;
    }

    withTotalDigits(totalDigits: string) {
        if (totalDigits == null) return this;
        this.addLine('total digits {0}', totalDigits);
        return this;
    }

    withDecimalPlaces(decimalPlaces: string) {
        if (decimalPlaces == null) return this;
        this.addLine('decimal places {0}', decimalPlaces);
        return this;
    }

    withIsWeakReference(isWeak: boolean = false) {
        if (!isWeak) return this;
        this.addLine('is weak');
        return this;
    }

    private withStringRestrictions(minLength: number = null, maxLength: number = null) {
        this.increaseIndentation();

        this.withMinLength(minLength);
        this.withMaxLength(maxLength);

        this.decreaseIndentation();

        return this;
    }

    private withNumericRestrictions(minValue: number = null, maxValue: number = null) {
        this.increaseIndentation();

        this.withMinValue(minValue);
        this.withMaxValue(maxValue);

        this.decreaseIndentation();

        return this;
    }

    private withDecimalRestrictions(totalDigits: string, decimalPlaces: string, minValue: number = null, maxValue: number = null) {
        this.increaseIndentation();
        this.withTotalDigits(totalDigits);
        this.withDecimalPlaces(decimalPlaces);
        this.decreaseIndentation();

        this.withNumericRestrictions(minValue, maxValue);

        return this;
    }

    private withReferenceAdditions(isWeak: boolean = false) {
        this.increaseIndentation();
        this.withIsWeakReference(isWeak);
        this.decreaseIndentation();

        return this;
    }

    withStringProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                       maxLength: number, minLength: number = null, context: string = null, metaEdId: string = null) {
        this.withProperty('string', propertyIdentifier, documentation, isRequired, isCollection,
            context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);

        return this;
    }

    withCurrencyProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                         context: string = null, metaEdId: string = null) {
        return this.withProperty('currency', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
    }

    withIntegerProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                        maxValue: number = null, minValue: number = null, context: string = null, metaEdId: string = null) {
        this.withProperty('integer', propertyIdentifier, documentation, isRequired, isCollection,
            context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }

    withShortProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                      maxValue: number = null, minValue: number = null, context: string = null, metaEdId: string = null) {
        this.withProperty('short', propertyIdentifier, documentation, isRequired, isCollection,
            context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }

    withDecimalProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean, totalDigits: string,
                        decimalPlaces: string, minValue: number = null, maxValue: number = null,
                        context: string = null, metaEdId: string = null) {
        this.withProperty('decimal', propertyIdentifier, documentation, isRequired, isCollection,
            context, metaEdId);
        this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
        return this;
    }

    withReferenceProperty(propertyIdentifier: string, documentation: string, isRequired: boolean, isCollection: boolean,
                          isWeak: boolean = false, context: string = null, metaEdId: string = null) {
        this.withProperty('reference', propertyIdentifier, documentation, isRequired,
            isCollection, context, metaEdId);
        this.withReferenceAdditions(isWeak);
        return this;
    }

    withSharedDecimalProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
                              context: string = null, metaEdId: string = null) {
        return this.withSharedProperty('decimal', propertyIdentifier, named, documentation,
            isRequired, isCollection, context, metaEdId);
    }

    withSharedIntegerProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
                              context: string = null, metaEdId: string = null) {
        return this.withSharedProperty('integer', propertyIdentifier, named, documentation,
            isRequired, isCollection, context, metaEdId);
    }

    withSharedShortProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
                            context: string = null, metaEdId: string = null) {
        return this.withSharedProperty('short', propertyIdentifier, named, documentation,
            isRequired, isCollection, context, metaEdId);
    }

    withSharedStringProperty(propertyIdentifier: string, named: string, documentation: string, isRequired: boolean, isCollection: boolean,
                             context: string = null, metaEdId: string = null) {
        return this.withSharedProperty('string', propertyIdentifier, named, documentation,
            isRequired, isCollection, context, metaEdId);
    }

    withBooleanIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('bool', propertyIdentifier, documentation, context, metaEdId);
    }

    withDateIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('date', propertyIdentifier, documentation, context, metaEdId);
    }

    withDurationIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('duration', propertyIdentifier, documentation,
            context, metaEdId);
    }

    withTimeIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('time', propertyIdentifier, documentation, context, metaEdId);
    }

    withYearIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('year', propertyIdentifier, documentation, context, metaEdId);
    }

    withStringIdentity(propertyIdentifier: string, documentation: string, maxLength: number, minLength: number = null,
                       context: string = null, metaEdId: string = null) {
        this.withIdentityProperty('string', propertyIdentifier, documentation, context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);
        return this;
    }

    withIntegerIdentity(propertyIdentifier: string, documentation: string, maxValue: number = null, minValue: number = null,
                        context = null, metaEdId = null) {
        this.withIdentityProperty('integer', propertyIdentifier, documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }

    withShortIdentity(propertyIdentifier: string, documentation: string, maxValue: number = null, minValue: number = null,
                      context: string = null, metaEdId: string = null) {
        this.withIdentityProperty('short', propertyIdentifier, documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }

    withDecimalIdentity(propertyIdentifier: string, documentation: string, totalDigits: string, decimalPlaces: string,
                        minValue: number = null, maxValue: number = null, context: string = null, metaEdId: string = null) {
        this.withIdentityProperty('decimal', propertyIdentifier, documentation, context, metaEdId);
        this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
        return this;
    }

    withEnumerationIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('enumeration', propertyIdentifier, documentation,
            context, metaEdId);
    }

    withReferenceIdentity(propertyIdentifier: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('reference', propertyIdentifier, documentation,
            context, metaEdId);
    }

    withDescriptorIdentity(descriptorName: string, documentation: string, context: string = null, metaEdId: string = null) {
        return this.withIdentityProperty('descriptor', descriptorName, documentation,
            context, metaEdId);
    }

    withStringIdentityRename(propertyIdentifier: string, basePropertyIdentifier: string, documentation: string,
                             maxLength: number, minLength: number = null, context: string = null, metaEdId: string = null) {
        this.withIdentityRenameProperty('string', propertyIdentifier, basePropertyIdentifier,
            documentation, context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);
        return this;
    }

    withIntegerIdentityRename(propertyIdentifier: string, basePropertyIdentifier: string, documentation: string,
                              maxValue: number = null, minValue: number = null, context: string = null, metaEdId: string = null) {
        this.withIdentityRenameProperty('integer', propertyIdentifier, basePropertyIdentifier,
            documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }

    withEnumerationItem(shortDescription: string, documentation: string = null, metaEdId: string = null) {
        this.withStartProperty('item', shortDescription, metaEdId);
        if (documentation != null) {
            this.withDocumentation(documentation);
        }
        this.withEndProperty();
        return this;
    }
}

