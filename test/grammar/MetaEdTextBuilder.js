"use strict";
const StringHelper_1 = require('../../src/common/StringHelper');
class MetaEdTextBuilder {
    constructor() {
        this.textLines = [];
        this.indentationLevel = 0;
    }
    toString() {
        return this.textLines.join('\r\n');
    }
    getIndentation() {
        return ' '.repeat(this.indentationLevel * 2);
    }
    increaseIndentation() {
        this.indentationLevel += 1;
    }
    decreaseIndentation() {
        this.indentationLevel -= 1;
    }
    addLineWithoutIndentation(line, ...parameters) {
        this.textLines.push(StringHelper_1.default.format(line, ...parameters));
    }
    addLine(line, ...parameters) {
        const indention = this.getIndentation();
        this.textLines.push(indention + StringHelper_1.default.format(line, ...parameters));
    }
    withBlankLine() {
        this.addLineWithoutIndentation('');
        return this;
    }
    withTrailingText(text) {
        const idx = this.textLines.length - 1;
        this.textLines[idx] = this.textLines[idx] + text;
        return this;
    }
    withBeginNamespace(identifier, projectExtension = null) {
        if (projectExtension == null) {
            this.addLine('Begin Namespace {0} core', identifier);
        }
        else {
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
    withComment(comment) {
        this.addLine('//{0}', comment);
        return this;
    }
    withDocumentation(...documentationLines) {
        const documentation = 'documentation';
        this.addLine(documentation);
        return this.withDocumentationLines(documentationLines);
    }
    withExtendedDocumentation(...documentationLines) {
        const extendedDocumentation = 'extended documentation';
        this.addLine(extendedDocumentation);
        return this.withDocumentationLines(documentationLines);
    }
    withUseCaseDocumentation(...documentationLines) {
        const useCaseDocumentation = 'use case documentation';
        this.addLine(useCaseDocumentation);
        return this.withDocumentationLines(documentationLines);
    }
    withDocumentationLines(...documentationLines) {
        const documentationPrefix = '\'';
        for (const line of documentationLines) {
            this.addLine('{0}{1}', documentationPrefix, line);
        }
        return this;
    }
    withMetaEdId(metaEdId) {
        if (metaEdId == null)
            return this;
        if (this.textLines.length > 0) {
            const lastLine = this.textLines[this.textLines.length - 1];
            this.textLines[this.textLines.length - 1] =
                StringHelper_1.default.format('{0} [{1}]', lastLine, metaEdId);
        }
        else {
            this.addLine('[{0}]', metaEdId);
        }
        return this;
    }
    withChildElement(elementType, identifier, metaEdId = null) {
        this.addLine('{0} {1}', elementType, identifier);
        this.withMetaEdId(metaEdId);
        return this;
    }
    withStartTopLevel(keyword, identifier, baseIdentifier = null) {
        if (baseIdentifier == null) {
            this.addLine('{0} {1}', keyword, identifier);
        }
        else {
            this.addLine('{0} {1} based on {2}', keyword, identifier, baseIdentifier);
        }
        this.increaseIndentation();
        return this;
    }
    withStartTopLevelExtension(keyword, identifier) {
        this.addLine('{0} {1} additions', keyword, identifier);
        this.increaseIndentation();
        return this;
    }
    withEndTopLevel() {
        this.decreaseIndentation();
        return this;
    }
    withCascadeUpdate() {
        this.addLine('allow primary key updates');
        return this;
    }
    withStartMapType(isRequired = true) {
        this.addLine(isRequired ? 'with map type' : 'with optional map type');
        this.increaseIndentation();
        return this;
    }
    withEndMapType() {
        this.decreaseIndentation();
        return this;
    }
    withStartEnumeration(identifier) {
        return this.withStartTopLevel('Enumeration', identifier);
    }
    withEndEnumeration() {
        return this.withEndTopLevel();
    }
    withStartDescriptor(identifier) {
        return this.withStartTopLevel('Descriptor', identifier);
    }
    withEndDescriptor() {
        return this.withEndTopLevel();
    }
    withStartDomainEntity(identifier) {
        return this.withStartTopLevel('Domain Entity', identifier);
    }
    withEndDomainEntity() {
        return this.withEndTopLevel();
    }
    withStartAssociationExtension(extensionName) {
        return this.withStartTopLevelExtension('Association', extensionName);
    }
    withEndAssociationExtension() {
        return this.withEndTopLevel();
    }
    withStartDomainEntityExtension(identifier) {
        return this.withStartTopLevelExtension('Domain Entity', identifier);
    }
    withEndDomainEntityExtension() {
        return this.withEndTopLevel();
    }
    withStartAbstractEntity(identifier) {
        return this.withStartTopLevel('Abstract Entity', identifier);
    }
    withEndAbstractEntity() {
        return this.withEndTopLevel();
    }
    withStartChoiceType(identifier) {
        return this.withStartTopLevel('Choice Common Type', identifier);
    }
    withEndChoiceType() {
        return this.withEndTopLevel();
    }
    withStartCommonDecimal(identifier) {
        return this.withStartTopLevel('Common Decimal', identifier);
    }
    withEndCommonDecimal() {
        return this.withEndTopLevel();
    }
    withStartCommonInteger(identifier) {
        return this.withStartTopLevel('Common Integer', identifier);
    }
    withEndCommonInteger() {
        return this.withEndTopLevel();
    }
    withStartCommonShort(identifier) {
        return this.withStartTopLevel('Common Short', identifier);
    }
    withEndCommonShort() {
        return this.withEndTopLevel();
    }
    withStartCommonString(identifier) {
        return this.withStartTopLevel('Common String', identifier);
    }
    withEndCommonString() {
        return this.withEndTopLevel();
    }
    withStartCommonType(identifier) {
        return this.withStartTopLevel('Common Type', identifier);
    }
    withEndCommonType() {
        return this.withEndTopLevel();
    }
    withStartCommonTypeExtension(identifier) {
        return this.withStartTopLevelExtension('Common Type', identifier);
    }
    withEndCommonTypeExtension() {
        return this.withEndTopLevel();
    }
    withStartInlineCommonType(identifier) {
        return this.withStartTopLevel('Inline Common Type', identifier);
    }
    withEndInlineCommonType() {
        return this.withEndTopLevel();
    }
    withStartAssociation(identifier) {
        return this.withStartTopLevel('Association', identifier);
    }
    withEndAssociation() {
        return this.withEndTopLevel();
    }
    withStartAssociationSubclass(associationName, baseAssociationName) {
        return this.withStartTopLevel('Association', associationName, baseAssociationName);
    }
    withEndAssociationSubclass() {
        return this.withEndTopLevel();
    }
    withStartDomainEntitySubclass(entityName, baseEntityName) {
        return this.withStartTopLevel('Domain Entity', entityName, baseEntityName);
    }
    withEndDomainEntitySubclass() {
        return this.withEndTopLevel();
    }
    withStartInterchange(interchangeName) {
        return this.withStartTopLevel('Interchange', interchangeName);
    }
    withEndInterchange() {
        return this.withEndTopLevel();
    }
    withStartInterchangeExtension(identifier) {
        return this.withStartTopLevelExtension('Interchange', identifier);
    }
    withEndInterchangeExtension() {
        return this.withEndTopLevel();
    }
    withElement(domainEntityName, metaEdId = null) {
        return this.withChildElement('element', domainEntityName, metaEdId);
    }
    withIdentityTemplate(identityTemplateName, metaEdId = null) {
        return this.withChildElement('identity template', identityTemplateName, metaEdId);
    }
    withStartDomain(domainName) {
        return this.withStartTopLevel('Domain', domainName);
    }
    withEndDomain() {
        return this.withEndTopLevel();
    }
    withStartSubdomain(subdomainName, parentDomainName) {
        this.addLine('Subdomain {0} of {1}', subdomainName, parentDomainName);
        this.increaseIndentation();
        return this;
    }
    withEndSubdomain() {
        return this.withEndTopLevel();
    }
    withDomainItem(domainItemName, metaEdId = null) {
        return this.withChildElement('domain item', domainItemName, metaEdId);
    }
    withIdentityIndicator() {
        const identity = 'is part of identity';
        this.addLine(identity);
        return this;
    }
    withIdentityRenameIndicator(basePropertyIdentifier) {
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
    withContext(context, shortenTo = null) {
        if (context == null)
            return this;
        const withContext = 'with context';
        if (shortenTo == null) {
            this.addLine('{0} {1}', withContext, context);
        }
        else {
            this.addLine('{0} {1} shorten to {2}', withContext, context, shortenTo);
        }
        return this;
    }
    withMergePartOfReference(mergePropertyPath, targetPropertyPath) {
        this.addLine('merge {0} with {1}', mergePropertyPath, targetPropertyPath);
        return this;
    }
    withStartProperty(propertyType, propertyIdentifier, metaEdId = null) {
        this.addLine('{0} {1}', propertyType, propertyIdentifier);
        this.withMetaEdId(metaEdId);
        this.increaseIndentation();
        return this;
    }
    withStartSharedProperty(propertyType, propertyIdentifier, named, metaEdId = null) {
        this.addLine('shared {0} {1} named {2}', propertyType, propertyIdentifier, named);
        this.withMetaEdId(metaEdId);
        this.increaseIndentation();
        return this;
    }
    withEndProperty() {
        this.decreaseIndentation();
        return this;
    }
    withProperty(propertyType, propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);
        this.withPropertyElements(documentation, isRequired, isCollection, context);
        this.withEndProperty();
        return this;
    }
    withSharedProperty(propertyType, propertyIdentifier, named, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        this.withStartSharedProperty(propertyType, propertyIdentifier, named, metaEdId);
        this.withPropertyElements(documentation, isRequired, isCollection, context);
        this.withEndProperty();
        return this;
    }
    withIdentityProperty(propertyType, propertyIdentifier, documentation, context = null, metaEdId = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);
        this.withDocumentation(documentation);
        this.withIdentityIndicator();
        this.withContext(context);
        this.withEndProperty();
        return this;
    }
    withIdentityRenameProperty(propertyType, propertyIdentifier, basePropertyIdentifier, documentation, context = null, metaEdId = null) {
        this.withStartProperty(propertyType, propertyIdentifier, metaEdId);
        this.withDocumentation(documentation);
        this.withIdentityRenameIndicator(basePropertyIdentifier);
        this.withContext(context);
        this.withEndProperty();
        return this;
    }
    withPropertyElements(documentation, isRequired, isCollection, context) {
        this.withDocumentation(documentation);
        if (isRequired && isCollection) {
            this.withRequiredCollectionIndicator();
        }
        else if (isRequired && !isCollection) {
            this.withRequiredPropertyIndicator();
        }
        else if (!isRequired && isCollection) {
            this.withOptionalCollectionIndicator();
        }
        else if (!isRequired && !isCollection) {
            this.withOptionalPropertyIndicator();
        }
        this.withContext(context);
        return this;
    }
    withBooleanProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('bool', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withDateProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('date', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withDurationProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('duration', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withPercentProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('percent', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withTimeProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('time', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withYearProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('year', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withDomainEntityProperty(identifier, documentation, context = null, metaEdId = null) {
        this.withStartProperty('domain entity', identifier, metaEdId);
        this.withDocumentation(documentation);
        this.withContext(context);
        this.withEndProperty();
        return this;
    }
    withDescriptorProperty(descriptorName, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('descriptor', descriptorName, documentation, isRequired, isCollection, context, metaEdId);
    }
    withEnumerationProperty(enumerationName, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('enumeration', enumerationName, documentation, isRequired, isCollection, context, metaEdId);
    }
    withIncludeProperty(commonTypeName, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('include', commonTypeName, documentation, isRequired, isCollection, context, metaEdId);
    }
    withIncludeExtensionOverrideProperty(commonTypeName, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('include extension', commonTypeName, documentation, isRequired, isCollection, context, metaEdId);
    }
    withMinLength(minLength) {
        if (minLength == null)
            return this;
        this.addLine('min length {0}', minLength);
        return this;
    }
    withMaxLength(maxLength) {
        if (maxLength == null)
            return this;
        this.addLine('max length {0}', maxLength);
        return this;
    }
    withMinValue(minValue) {
        if (minValue == null)
            return this;
        this.addLine('min value {0}', minValue);
        return this;
    }
    withMaxValue(maxValue) {
        if (maxValue == null)
            return this;
        this.addLine('max value {0}', maxValue);
        return this;
    }
    withTotalDigits(totalDigits) {
        if (totalDigits == null)
            return this;
        this.addLine('total digits {0}', totalDigits);
        return this;
    }
    withDecimalPlaces(decimalPlaces) {
        if (decimalPlaces == null)
            return this;
        this.addLine('decimal places {0}', decimalPlaces);
        return this;
    }
    withIsWeakReference(isWeak = false) {
        if (!isWeak)
            return this;
        this.addLine('is weak');
        return this;
    }
    withStringRestrictions(minLength = null, maxLength = null) {
        this.increaseIndentation();
        this.withMinLength(minLength);
        this.withMaxLength(maxLength);
        this.decreaseIndentation();
        return this;
    }
    withNumericRestrictions(minValue = null, maxValue = null) {
        this.increaseIndentation();
        this.withMinValue(minValue);
        this.withMaxValue(maxValue);
        this.decreaseIndentation();
        return this;
    }
    withDecimalRestrictions(totalDigits, decimalPlaces, minValue = null, maxValue = null) {
        this.increaseIndentation();
        this.withTotalDigits(totalDigits);
        this.withDecimalPlaces(decimalPlaces);
        this.decreaseIndentation();
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withReferenceAdditions(isWeak = false) {
        this.increaseIndentation();
        this.withIsWeakReference(isWeak);
        this.decreaseIndentation();
        return this;
    }
    withStringProperty(propertyIdentifier, documentation, isRequired, isCollection, maxLength, minLength = null, context = null, metaEdId = null) {
        this.withProperty('string', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);
        return this;
    }
    withCurrencyProperty(propertyIdentifier, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withProperty('currency', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
    }
    withIntegerProperty(propertyIdentifier, documentation, isRequired, isCollection, maxValue = null, minValue = null, context = null, metaEdId = null) {
        this.withProperty('integer', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withShortProperty(propertyIdentifier, documentation, isRequired, isCollection, maxValue = null, minValue = null, context = null, metaEdId = null) {
        this.withProperty('short', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withDecimalProperty(propertyIdentifier, documentation, isRequired, isCollection, totalDigits, decimalPlaces, minValue = null, maxValue = null, context = null, metaEdId = null) {
        this.withProperty('decimal', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
        this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
        return this;
    }
    withReferenceProperty(propertyIdentifier, documentation, isRequired, isCollection, isWeak = false, context = null, metaEdId = null) {
        this.withProperty('reference', propertyIdentifier, documentation, isRequired, isCollection, context, metaEdId);
        this.withReferenceAdditions(isWeak);
        return this;
    }
    withSharedDecimalProperty(propertyIdentifier, named, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withSharedProperty('decimal', propertyIdentifier, named, documentation, isRequired, isCollection, context, metaEdId);
    }
    withSharedIntegerProperty(propertyIdentifier, named, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withSharedProperty('integer', propertyIdentifier, named, documentation, isRequired, isCollection, context, metaEdId);
    }
    withSharedShortProperty(propertyIdentifier, named, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withSharedProperty('short', propertyIdentifier, named, documentation, isRequired, isCollection, context, metaEdId);
    }
    withSharedStringProperty(propertyIdentifier, named, documentation, isRequired, isCollection, context = null, metaEdId = null) {
        return this.withSharedProperty('string', propertyIdentifier, named, documentation, isRequired, isCollection, context, metaEdId);
    }
    withBooleanIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('bool', propertyIdentifier, documentation, context, metaEdId);
    }
    withDateIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('date', propertyIdentifier, documentation, context, metaEdId);
    }
    withDurationIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('duration', propertyIdentifier, documentation, context, metaEdId);
    }
    withTimeIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('time', propertyIdentifier, documentation, context, metaEdId);
    }
    withYearIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('year', propertyIdentifier, documentation, context, metaEdId);
    }
    withStringIdentity(propertyIdentifier, documentation, maxLength, minLength = null, context = null, metaEdId = null) {
        this.withIdentityProperty('string', propertyIdentifier, documentation, context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);
        return this;
    }
    withIntegerIdentity(propertyIdentifier, documentation, maxValue = null, minValue = null, context = null, metaEdId = null) {
        this.withIdentityProperty('integer', propertyIdentifier, documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withShortIdentity(propertyIdentifier, documentation, maxValue = null, minValue = null, context = null, metaEdId = null) {
        this.withIdentityProperty('short', propertyIdentifier, documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withDecimalIdentity(propertyIdentifier, documentation, totalDigits, decimalPlaces, minValue = null, maxValue = null, context = null, metaEdId = null) {
        this.withIdentityProperty('decimal', propertyIdentifier, documentation, context, metaEdId);
        this.withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue);
        return this;
    }
    withEnumerationIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('enumeration', propertyIdentifier, documentation, context, metaEdId);
    }
    withReferenceIdentity(propertyIdentifier, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('reference', propertyIdentifier, documentation, context, metaEdId);
    }
    withDescriptorIdentity(descriptorName, documentation, context = null, metaEdId = null) {
        return this.withIdentityProperty('descriptor', descriptorName, documentation, context, metaEdId);
    }
    withStringIdentityRename(propertyIdentifier, basePropertyIdentifier, documentation, maxLength, minLength = null, context = null, metaEdId = null) {
        this.withIdentityRenameProperty('string', propertyIdentifier, basePropertyIdentifier, documentation, context, metaEdId);
        this.withStringRestrictions(minLength, maxLength);
        return this;
    }
    withIntegerIdentityRename(propertyIdentifier, basePropertyIdentifier, documentation, maxValue = null, minValue = null, context = null, metaEdId = null) {
        this.withIdentityRenameProperty('integer', propertyIdentifier, basePropertyIdentifier, documentation, context, metaEdId);
        this.withNumericRestrictions(minValue, maxValue);
        return this;
    }
    withEnumerationItem(shortDescription, documentation = null, metaEdId = null) {
        this.withStartProperty('item', shortDescription, metaEdId);
        if (documentation != null) {
            this.withDocumentation(documentation);
        }
        this.withEndProperty();
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MetaEdTextBuilder;
//# sourceMappingURL=MetaEdTextBuilder.js.map