import { ValidationRuleBase } from "../ValidationRuleBase";
    export class MergePropertyPathMustExist extends ValidationRuleBase<MetaEdGrammar.MergePropertyPathContext>
    {
        private _symbolTable: ISymbolTable;
        private _propertyPathLookup: IPropertyPathLookup;
        constructor(symbolTable: ISymbolTable, propertyPathLookup: IPropertyPathLookup) {
            this._propertyPathLookup = propertyPathLookup;
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.MergePropertyPathContext): boolean {
            var entityContext = LookupParentEntityContext(context);
            var propertyPathParts = context.propertyPath().PropertyPathParts();
            return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
        }
        public getFailureMessage(context: MetaEdGrammar.MergePropertyPathContext): string {
            return string.Format("Path {0} is not valid.", context.GetText());
        }
        private lookupParentEntityContext(context: MetaEdGrammar.MergePropertyPathContext): EntityContext {
            var definingEntityContext = context.parent.parent.parent.parent;
            var domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
            if (domainEntityContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
            }
            var domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
            if (domainEntityExtensionContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.DomainEntityExtensionEntityType(), domainEntityExtensionContext.extendeeName().IdText());
            }
            var domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
            if (domainEntitySubclassContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), domainEntitySubclassContext.entityName().IdText());
            }
            var associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
            if (associationContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
            }
            var associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
            if (associationExtensionContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.AssociationExtensionEntityType(), associationExtensionContext.extendeeName().IdText());
            }
            var associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
            if (associationSubclassContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), associationSubclassContext.associationName().IdText());
            }
            var abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
            if (abstractContext != null) {
                return this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
            }
            return null;
        }
    }
}