import { ValidationRuleBase } from "../ValidationRuleBase";
export class MergePropertyAndTargetPropertyMustMatch extends ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
{
    private _symbolTable: ISymbolTable;
    private _propertyPathLookup: IPropertyPathLookup;
    constructor(symbolTable: ISymbolTable, propertyPathLookup: IPropertyPathLookup) {
        this._symbolTable = symbolTable;
        this._propertyPathLookup = propertyPathLookup;
    }
    public isValid(context: MetaEdGrammar.MergePartOfReferenceContext): boolean {
        let entityContext = LookupParentEntityContext(context);
        let mergePropertyPathParts = context.mergePropertyPath().propertyPath().PropertyPathParts();
        let targetPropertyPathParts = context.targetPropertyPath().propertyPath().PropertyPathParts();
        let mergeProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, mergePropertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
        let targetProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, targetPropertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
        if (mergeProperty == null || targetProperty == null)
            return true;
        let mergePropertyType = mergeProperty.GetType();
        let targetPropertyType = targetProperty.GetType();
        if (mergePropertyType != targetPropertyType) {
            if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                return false;
        }
        if (mergeProperty.IdNode().GetText() != targetProperty.IdNode().GetText()) {
            if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                return false;
            if (!MatchBaseType(mergeProperty, targetProperty.IdNode().GetText()) && !MatchBaseType(targetProperty, mergeProperty.IdNode().GetText()))
                return false;
        }
        return true;
    }
    public getFailureMessage(context: MetaEdGrammar.MergePartOfReferenceContext): string {
        return `The merge paths '${}' and '${}' do not correspond to the same entity type.", context.mergePropertyPath().GetText(), context.targetPropertyPath().GetText());
    }
    private lookupParentEntityContext(context: MetaEdGrammar.MergePartOfReferenceContext): EntityContext {
        let definingEntityContext = context.parent.parent.parent;
        let domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        let domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        let domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            let domainEntity = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
            return domainEntity != null ? domainEntity : this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
        }
        let associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
        }
        let associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        let associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
        }
        let abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
    private isReferenceProperty(type: Type): boolean {
        return ((type == /*typeof*/MetaEdGrammar.ReferencePropertyContext) || (type == /*typeof*/MetaEdGrammar.FirstDomainEntityContext) || (type == /*typeof*/MetaEdGrammar.SecondDomainEntityContext));
    }
    private matchBaseType(referencingProperty: IContextWithIdentifier, baseTypeName: string): boolean {
        let entityName = referencingProperty.IdNode().GetText();
        let entityContext: EntityContext = null;
        entityContext = this._symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), entityName);
        if (entityContext != null) {
            let subclass = __as__<MetaEdGrammar.DomainEntitySubclassContext>(entityContext.Context, MetaEdGrammar.DomainEntitySubclassContext);
            return subclass.baseName().IdText() == baseTypeName;
        }
        entityContext = this._symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), entityName);
        if (entityContext != null) {
            let subclass = __as__<MetaEdGrammar.AssociationSubclassContext>(entityContext.Context, MetaEdGrammar.AssociationSubclassContext);
            return subclass.baseName().IdText() == baseTypeName;
        }
        return false;
    }
}
