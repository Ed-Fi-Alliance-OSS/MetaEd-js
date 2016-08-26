import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class MergePropertyPathMustExist extends ValidationRuleBase<MetaEdGrammar.MergePropertyPathContext>
{
    private symbolTable: ISymbolTable;
    private _propertyPathLookup: IPropertyPathLookup;
    constructor(symbolTable: ISymbolTable, propertyPathLookup: IPropertyPathLookup) {
        this._propertyPathLookup = propertyPathLookup;
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.MergePropertyPathContext): boolean {
        let entityContext = LookupParentEntityContext(context);
        let propertyPathParts = context.propertyPath().PropertyPathParts();
        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
    }
    public getFailureMessage(context: MetaEdGrammar.MergePropertyPathContext): string {
        return `Path ${context.GetText()} is not valid.`;
    }
    private lookupParentEntityContext(context: MetaEdGrammar.MergePropertyPathContext): EntityContext {
        let definingEntityContext = context.parent.parent.parent.parent;
        let domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        let domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.DomainEntityExtensionEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        let domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), domainEntitySubclassContext.entityName().IdText());
        }
        let associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
        }
        let associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.AssociationExtensionEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        let associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), associationSubclassContext.associationName().IdText());
        }
        let abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this.symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
}
