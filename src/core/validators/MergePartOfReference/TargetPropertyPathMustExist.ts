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
        let entityContext = LookupParentEntityContext(context);
        let propertyPathParts = context.propertyPath().PropertyPathParts();
        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
    }
    public getFailureMessage(context: MetaEdGrammar.TargetPropertyPathContext): string {
        return `Path ${} is not valid or lists properties that are not part of the primary key.", context.GetText());
    }
    private lookupParentEntityContext(context: MetaEdGrammar.TargetPropertyPathContext): EntityContext {
        let definingEntityContext = context.parent.parent.parent.parent;
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
}
