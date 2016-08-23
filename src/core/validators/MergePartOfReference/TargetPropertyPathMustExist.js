var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class TargetPropertyPathMustExist extends ValidationRuleBase {
                    constructor(symbolTable, propertyPathLookup) {
                        this._symbolTable = symbolTable;
                        this._propertyPathLookup = propertyPathLookup;
                    }
                    isValid(context) {
                        var entityContext = LookupParentEntityContext(context);
                        var propertyPathParts = context.propertyPath().PropertyPathParts();
                        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
                    }
                    getFailureMessage(context) {
                        return string.Format("Path {0} is not valid or lists properties that are not part of the primary key.", context.GetText());
                    }
                    lookupParentEntityContext(context) {
                        var definingEntityContext = context.parent.parent.parent.parent;
                        var domainEntityContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntityContext);
                        if (domainEntityContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
                        }
                        var domainEntityExtensionContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
                        if (domainEntityExtensionContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
                        }
                        var domainEntitySubclassContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
                        if (domainEntitySubclassContext != null) {
                            var domainEntity = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
                            return domainEntity != null ? domainEntity : this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
                        }
                        var associationContext = __as__(definingEntityContext, MetaEdGrammar.AssociationContext);
                        if (associationContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
                        }
                        var associationExtensionContext = __as__(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
                        if (associationExtensionContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
                        }
                        var associationSubclassContext = __as__(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
                        if (associationSubclassContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
                        }
                        var abstractContext = __as__(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
                        if (abstractContext != null) {
                            return this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
                        }
                        return null;
                    }
                }
                MergePartOfReference.TargetPropertyPathMustExist = TargetPropertyPathMustExist;
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=TargetPropertyPathMustExist.js.map