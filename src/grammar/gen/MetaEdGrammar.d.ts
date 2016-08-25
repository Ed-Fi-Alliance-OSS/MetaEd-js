declare namespace MetaEdGrammar {
    export class ParserRuleContext {
        start: any;
    }

    export class ChoiceTypeContext extends ParserRuleContext { }
    export class IErrorNode extends ParserRuleContext { }
    export class ITerminalNode extends ParserRuleContext { }
    export class AbstractEntityContext extends ParserRuleContext { 
        abstractEntityName()
        property()
    }
    export class AbstractEntityNameContext extends ParserRuleContext { }
    export class AssociationContext extends ParserRuleContext {
        secondDomainEntity()
        firstDomainEntity()
        associationName()
     }
    export class CommonDecimalContext extends ParserRuleContext {
        minValueDecimal()
        maxValueDecimal()
        commonDecimalName()
        decimalPlaces()
        totalDigits()
    }
    export class AssociationExtensionContext extends ParserRuleContext {
        EntityName()
        GetAncestorContext<T>()
        ASSOCIATION()
        ADDITIONS()
        extendeeName()
    }
    export class AssociationNameContext extends ParserRuleContext { }
    export class AssociationSubclassContext extends ParserRuleContext {
        baseName()
        associationName()
        property()
        ASSOCIATION()
        BASED_ON()
     }
    export class BaseKeyNameContext extends ParserRuleContext { }
    export class BaseNameContext extends ParserRuleContext { }
    export class BooleanPropertyContext extends ParserRuleContext { }
    export class CascadeUpdateContext extends ParserRuleContext { }
    export class ChoiceNameContext extends ParserRuleContext { }
    export class CollectionContext extends ParserRuleContext { }
    export class CommonDecimalNameContext extends ParserRuleContext { }
    export class CommonIntegerNameContext extends ParserRuleContext { }
    export class CommonIntegerContext extends ParserRuleContext {
        commonIntegerName()
        minValue()
        maxValue()
    }
    export class CommonShortNameContext extends ParserRuleContext { }
    export class CommonShortContext extends ParserRuleContext {
        commonShortName()
        minValue()
        maxValue()
    }
    export class CommonStringNameContext extends ParserRuleContext { }
    export class CommonStringContext extends ParserRuleContext {
        commonStringName()
        minLength()
        maxLength()
    }
    export class CommonNameContext extends ParserRuleContext { }
    export class CommonTypeContext extends ParserRuleContext { }
    export class CommonTypeExtensionContext extends ParserRuleContext {
        extendeeName()
        COMMON_TYPE()
        ADDITIONS()
    }
    export class CurrencyPropertyContext extends ParserRuleContext { }
    export class DatePropertyContext extends ParserRuleContext { }
    export class DecimalPlacesContext extends ParserRuleContext { }
    export class DecimalPropertyContext extends ParserRuleContext {
        maxValueDecimal()
        minValueDecimal()
        propertyName()
        ParentIdentifier()
        ParentTypeName()
        totalDigits()
        decimalPlaces()
    }
    export class DecimalValueContext extends ParserRuleContext { }
    export class DescriptorContext extends ParserRuleContext {
        descriptorName()
        withMapType()
    }
    export class DescriptorNameContext extends ParserRuleContext { }
    export class DescriptorPropertyContext extends ParserRuleContext {
        propertyName()
    }
    export class DocumentationContext extends ParserRuleContext { }
    export class FooterDocumentationContext extends ParserRuleContext { }
    export class ExtendedDocumentationContext extends ParserRuleContext { }
    export class UseCaseDocumentationContext extends ParserRuleContext { }
    export class DocumentationLineContext extends ParserRuleContext { }
    export class DomainContext extends ParserRuleContext {
        EntityName()
        domainItem()
    }
    export class DomainItemContext extends ParserRuleContext {
        IdText()
    }
    export class DomainNameContext extends ParserRuleContext { }
    export class DomainEntityContext extends ParserRuleContext {
        entityName()
        GetAncestorContext<T>()
        property()
    }
    export class DomainEntityExtensionContext extends ParserRuleContext {
        EntityName()
        extendeeName()
        DOMAIN_ENTITY()
        ADDITIONS()
        GetAncestorContext<T>()
    }
    export class DomainEntitySubclassContext extends ParserRuleContext {
        baseName()
        entityName()
        DOMAIN_ENTITY()
        BASED_ON()
        property()
    }
    export class DurationPropertyContext extends ParserRuleContext { }
    export class EntityConfigurationContext extends ParserRuleContext { }
    export class EntityNameContext extends ParserRuleContext { }
    export class EnumerationContext extends ParserRuleContext {
        enumerationName()
        enumerationItem()
    }
    export class EnumerationNameContext extends ParserRuleContext { }
    export class EnumerationPropertyContext extends ParserRuleContext {
        propertyName()
    }
    export class ExtendeeNameContext extends ParserRuleContext { }
    export class FirstDomainEntityContext extends ParserRuleContext { 
        IdText()
        withContext()
        parent
    }
    export class IncludePropertyContext extends ParserRuleContext {
        includeExtensionOverride()
        propertyComponents()
        PropertyName()
        propertyName()
        GetAncestorContext<T>()
    }
    export class IncludeExtensionOverrideContext extends ParserRuleContext { }
    export class InlineCommonNameContext extends ParserRuleContext { }
    export class InlineCommonTypeContext extends ParserRuleContext {
        EntityName()
        GetAncestorContext<T>()
    }
    export class Signed_intContext extends ParserRuleContext { }
    export class IntegerPropertyContext extends ParserRuleContext {
        propertyName()
        ParentTypeName()
        ParentIdentifier()
        maxValue()
        minValue()
    }
    export class InterchangeContext extends ParserRuleContext {
        interchangeName()
        interchangeComponent()
    }
    export class InterchangeComponentContext extends ParserRuleContext { }
    export class InterchangeElementContext extends ParserRuleContext {
        IdText()
    }
    export class InterchangeExtensionContext extends ParserRuleContext {
        interchangeExtensionComponent()
        extendeeName()
        INTERCHANGE()
    }
    export class InterchangeExtensionComponentContext extends ParserRuleContext { }
    export class InterchangeIdentityTemplateContext extends ParserRuleContext {
        IdText()
    }
    export class InterchangeNameContext extends ParserRuleContext { }
    export class EnumerationItemContext extends ParserRuleContext { }
    export class MaxLengthContext extends ParserRuleContext { }
    export class MaxValueContext extends ParserRuleContext { }
    export class MaxValueDecimalContext extends ParserRuleContext { }
    export class IsWeakReferenceContext extends ParserRuleContext { }
    export class MergePartOfReferenceContext extends ParserRuleContext {
        Parent
        mergePropertyPath(): any
        targetPropertyPath()
        parent
        GetAncestorContext<T>()
    }
    export class MergePropertyPathContext extends ParserRuleContext {
        parent
        propertyPath(): any
        GetText(): any
    }
    export class MetaEdContext extends ParserRuleContext { }
    export class MinLengthContext extends ParserRuleContext { }
    export class MinValueContext extends ParserRuleContext { }
    export class MinValueDecimalContext extends ParserRuleContext { }
    export class NamespaceContext extends ParserRuleContext { }
    export class NamespaceNameContext extends ParserRuleContext { }
    export class NamespaceTypeContext extends ParserRuleContext { }
    export class NamespaceProjectExtensionContext extends ParserRuleContext { }
    export class OptionalContext extends ParserRuleContext { }
    export class OptionalCollectionContext extends ParserRuleContext { }
    export class OptionalMapTypeContext extends ParserRuleContext { }
    export class PercentPropertyContext extends ParserRuleContext { }
    export class IdentityContext extends ParserRuleContext {
        GetAncestorContext<T>()
    }
    export class IdentityRenameContext extends ParserRuleContext {
        GetAncestorContext<T>()
    }
    export class MetaEdIdContext extends ParserRuleContext {
        GetValue(): any
    }
    export class PropertyContext extends ParserRuleContext { }
    export class PropertyAnnotationContext extends ParserRuleContext { }
    export class PropertyComponentsContext extends ParserRuleContext { }
    export class PropertyNameContext extends ParserRuleContext { }
    export class PropertyPathContext extends ParserRuleContext { }
    export class ReferencePropertyContext extends ParserRuleContext {
        propertyName(): any
    }
    export class RequiredContext extends ParserRuleContext { }
    export class RequiredCollectionContext extends ParserRuleContext { }
    export class RequiredMapTypeContext extends ParserRuleContext { }
    export class SecondDomainEntityContext extends ParserRuleContext {
        parent
        IdText()
        withContext()
     }
    export class ShortDescriptionContext extends ParserRuleContext { }
    export class SharedDecimalPropertyContext extends ParserRuleContext {
        sharedPropertyType(): any
        propertyName(): any
    }
    export class SharedIntegerPropertyContext extends ParserRuleContext {
        sharedPropertyType(): any
        propertyName(): any
    }
    export class SharedShortPropertyContext extends ParserRuleContext {
        propertyName(): any
        sharedPropertyType(): any
    }
    export class SharedStringPropertyContext extends ParserRuleContext {
        propertyName(): any
        sharedPropertyType(): any
    }
    export class SharedPropertyTypeContext extends ParserRuleContext { }
    export class ShortenToNameContext extends ParserRuleContext { }
    export class ShortPropertyContext extends ParserRuleContext {
        propertyName(): any
        ParentTypeName(): any
        ParentIdentifier(): any
        minValue(): any
        maxValue(): any
    }
    export class StringPropertyContext extends ParserRuleContext {
        propertyName(): any
        minLength(): any
        maxLength(): any
        ParentTypeName(): any
        ParentIdentifier(): any
    }
    export class SubdomainContext extends ParserRuleContext {
        parentDomainName(): any
        EntityName(): any
        domainItem(): any
    }
    export class ParentDomainNameContext extends ParserRuleContext { }
    export class SubdomainNameContext extends ParserRuleContext { }
    export class SubdomainPositionContext extends ParserRuleContext { }
    export class TargetPropertyPathContext extends ParserRuleContext {
        propertyPath(): any
        GetText(): any
    }
    export class TimePropertyContext extends ParserRuleContext { }
    export class TopLevelEntityContext extends ParserRuleContext { }
    export class TotalDigitsContext extends ParserRuleContext { }
    export class UnaryOperatorContext extends ParserRuleContext { }
    export class IsQueryableFieldContext extends ParserRuleContext { }
    export class IsQueryableOnlyContext extends ParserRuleContext { }
    export class WithContextContext extends ParserRuleContext { }
    export class WithContextNameContext extends ParserRuleContext { }
    export class WithMapTypeContext extends ParserRuleContext { }
    export class YearPropertyContext extends ParserRuleContext { }
}

declare module "MetaEdGrammar" {
    export = MetaEdGrammar;
}
