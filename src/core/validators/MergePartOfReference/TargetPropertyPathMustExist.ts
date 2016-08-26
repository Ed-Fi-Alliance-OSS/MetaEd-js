import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class TargetPropertyPathMustExist extends ValidationRuleBase<MetaEdGrammar.TargetPropertyPathContext>
{
    private symbolTable: ISymbolTable;
    private _propertyPathLookup: IPropertyPathLookup;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable, propertyPathLookup: IPropertyPathLookup) {
        super();
        this.symbolTable = symbolTable;
        this._propertyPathLookup = propertyPathLookup;
    }
    public isValid(context: MetaEdGrammar.TargetPropertyPathContext): boolean {
        let entityContext = LookupParentEntityContext(context);
        let propertyPathParts = context.propertyPath().PropertyPathParts();
        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
    }
    public getFailureMessage(context: MetaEdGrammar.TargetPropertyPathContext): string {
        return `Path ${context.GetText()} is not valid or lists properties that are not part of the primary key.`;
    }
    private lookupParentEntityContext(context: MetaEdGrammar.TargetPropertyPathContext): EntityContext {
        let definingEntityContext = context.parent.parent.parent.parent;
        let domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        let domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        let domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            let domainEntity = this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
            return domainEntity != null ? domainEntity : this.symbolTable.Get(this.symbolTableEntityType.abstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
        }
        let associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationEntityType(), associationContext.associationName().IdText());
        }
        let associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        let associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationEntityType(), associationSubclassContext.baseName().IdText());
        }
        let abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.abstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
}
