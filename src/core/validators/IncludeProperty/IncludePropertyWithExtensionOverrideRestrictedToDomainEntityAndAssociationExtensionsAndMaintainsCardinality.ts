import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        if (context.includeExtensionOverride() == null)
            return true;
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        switch (topLevelEntity.RuleIndex) {
            case MetaEdGrammar.RULE_domainEntityExtension:
                return MaintainsCardinalityOnDomainEntity(context, __as__<MetaEdGrammar.DomainEntityExtensionContext>(topLevelEntity, MetaEdGrammar.DomainEntityExtensionContext));
            case MetaEdGrammar.RULE_associationExtension:
                return MaintainsCardinalityOnAssociation(context, __as__<MetaEdGrammar.AssociationExtensionContext>(topLevelEntity, MetaEdGrammar.AssociationExtensionContext));
            default:
                return false;
        }
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for properties on Domain Entity extension and Association extension, and must maintain original cardinality on extendee.`;
    }
    private maintainsCardinalityOnDomainEntity(overriddenIncludePropertyContext: MetaEdGrammar.IncludePropertyContext, extensionEntityContext: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        let extendeeEntityContext = this.symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    private maintainsCardinalityOnAssociation(overriddenIncludePropertyContext: MetaEdGrammar.IncludePropertyContext, extensionEntityContext: MetaEdGrammar.AssociationExtensionContext): boolean {
        let extendeeEntityContext = this.symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    private static maintainsCardinality(overriddenIncludePropertyContext: MetaEdGrammar.IncludePropertyContext, extendeeEntityContext: EntityContext): boolean {
        let originalIncludePropertyContext = extendeeEntityContext.PropertySymbolTable.Get(overriddenIncludePropertyContext.PropertyName());
        if (!(originalIncludePropertyContext instanceof MetaEdGrammar.IncludePropertyContext))
            return false;
        return CardinalitiesMatch(__as__<MetaEdGrammar.IncludePropertyContext>(originalIncludePropertyContext, MetaEdGrammar.IncludePropertyContext), overriddenIncludePropertyContext);
    }
    public static cardinalitiesMatch(includePropertyContext: MetaEdGrammar.IncludePropertyContext, otherIncludePropertyContext: MetaEdGrammar.IncludePropertyContext): boolean {
        let propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
        let otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
        if (propertyAnnotationContext.required() != null && otherPropertyAnnotationContext.required() != null)
            return true;
        if (propertyAnnotationContext.optional() != null && otherPropertyAnnotationContext.optional() != null)
            return true;
        if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().requiredCollection() != null && otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().requiredCollection() != null)
            return true;
        if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().optionalCollection() != null && otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().optionalCollection() != null)
            return true;
        return false;
    }
}
