using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePropertyPathMustExist {
                }
                ValidationRuleBase < MetaEdGrammar.MergePropertyPathContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        readonly: IPropertyPathLookup, _propertyPathLookup: ,
                        MergePropertyPathMustExist(ISymbolTable = symbolTable, IPropertyPathLookup = propertyPathLookup) {
                            _propertyPathLookup = propertyPathLookup;
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, MergePropertyPathContext = context) {
                            var entityContext = LookupParentEntityContext(context);
                            var propertyPathParts = context.propertyPath().PropertyPathParts();
                            return _propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, MergePropertyPathContext = context) {
                            return string.Format("Path {0} is not valid.", context.GetText());
                        },
                        EntityContext: LookupParentEntityContext(MetaEdGrammar.MergePropertyPathContext, context) };
                {
                    // first parent - mergePartOfReference
                    // second parent - referenceProperty
                    // third parent - property collection
                    // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
                    var definingEntityContext = context.parent.parent.parent.parent;
                    var domainEntityContext = definingEntityContext;
                    if (domainEntityContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
                    }
                    var domainEntityExtensionContext = definingEntityContext;
                    if (domainEntityExtensionContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.DomainEntityExtensionEntityType(), domainEntityExtensionContext.extendeeName().IdText());
                    }
                    var domainEntitySubclassContext = definingEntityContext;
                    if (domainEntitySubclassContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), domainEntitySubclassContext.entityName().IdText());
                    }
                    var associationContext = definingEntityContext;
                    if (associationContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
                    }
                    var associationExtensionContext = definingEntityContext;
                    if (associationExtensionContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AssociationExtensionEntityType(), associationExtensionContext.extendeeName().IdText());
                    }
                    var associationSubclassContext = definingEntityContext;
                    if (associationSubclassContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), associationSubclassContext.associationName().IdText());
                    }
                    var abstractContext = definingEntityContext;
                    if (abstractContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
                    }
                    return null;
                }
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePropertyPathMustExist.js.map