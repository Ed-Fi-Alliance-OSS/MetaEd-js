import { ValidationRuleBase } from "../ValidationRuleBase";
export class TargetPropertyPathMustExist extends ValidationRuleBase<MetaEdGrammar.TargetPropertyPathContext>
{
    private _symbolTable: ISymbolTable;
    private _propertyPathLookup: IPropertyPathLookup;
    constructor(symbolTable: ISymbolTable, propertyPathLookup: IPropertyPathLookup) {
        this._symbolTable = symbolTable;
        this._propertyPathLookup = propertyPathLookup;
    }
    public isValid(context: MetaEdGrammar.TargetPropertyPathContext): boolean {
        var entityContext = LookupParentEntityContext(context);
        var propertyPathParts = context.propertyPath().PropertyPathParts();
        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
    }
    public getFailureMessage(context: MetaEdGrammar.TargetPropertyPathContext): string {
        return string.Format("Path {0} is not valid or lists properties that are not part of the primary key.", context.GetText());
    }
    private lookupParentEntityContext(context: MetaEdGrammar.TargetPropertyPathContext): EntityContext {
        var definingEntityContext = context.parent.parent.parent.parent;
        var domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        var domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        var domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            var domainEntity = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
            return domainEntity != null ? domainEntity : this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
        }
        var associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
        }
        var associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        var associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
        }
        var abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
}
