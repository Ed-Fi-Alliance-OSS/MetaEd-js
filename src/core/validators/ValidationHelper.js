// @flow
import grammarInstance from '../../grammar/MetaEdGrammarInstance';

export function getAncestorContext(ruleContext: any, ruleIndex: number) {
    let ancestor = getAncestorContextNullable(ruleContext, ruleIndex);
    if (ancestor === null) {
        throw new Error(`Unable to find matching Ancestor ${grammarInstance.ruleNames[ruleIndex]} on context of type ${grammarInstance.ruleNames[ruleContext.ruleIndex()]}`);
    }
    return ancestor;
}

function getAncestorContextNullable(ruleContext: any, ruleIndex: number) {
    if (ruleContext.ruleIndex === ruleIndex) return ruleContext;
    if (ruleContext.parentCtx === null) return null;
    return getAncestorContextNullable(ruleContext.parentCtx, ruleIndex);
}

export function isExtensionNamespace(namespaceContext: any) {
    return namespaceContext.namespaceType().namespaceProjectExtension() !== null;
}

export function namespaceNameFor(namespaceContext: any) : string {
    return namespaceContext.namespaceName().NAMESPACE_ID().getText();
}

export function getProperty(propertyContext: any) : any {
    if (propertyContext.booleanProperty()) return propertyContext.booleanProperty();
    if (propertyContext.currencyProperty()) return propertyContext.currencyProperty();
    if (propertyContext.dateProperty()) return propertyContext.dateProperty();
    if (propertyContext.decimalProperty()) return propertyContext.decimalProperty();
    if (propertyContext.descriptorProperty()) return propertyContext.descriptorProperty();
    if (propertyContext.durationProperty()) return propertyContext.durationProperty();
    if (propertyContext.enumerationProperty()) return propertyContext.enumerationProperty();
    if (propertyContext.includeProperty()) return propertyContext.includeProperty();
    if (propertyContext.integerProperty()) return propertyContext.integerProperty();
    if (propertyContext.percentProperty()) return propertyContext.percentProperty();
    if (propertyContext.referenceProperty()) return propertyContext.referenceProperty();
    if (propertyContext.sharedDecimalProperty()) return propertyContext.sharedDecimalProperty();
    if (propertyContext.sharedIntegerProperty()) return propertyContext.sharedIntegerProperty();
    if (propertyContext.sharedShortProperty()) return propertyContext.sharedShortProperty();
    if (propertyContext.sharedStringProperty()) return propertyContext.sharedStringProperty();
    if (propertyContext.shortProperty()) return propertyContext.shortProperty();
    if (propertyContext.stringProperty()) return propertyContext.stringProperty();
    if (propertyContext.timeProperty()) return propertyContext.timeProperty();
    if (propertyContext.yearProperty()) return propertyContext.yearProperty();
    return null;
}