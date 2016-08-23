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
                class TargetPropertyPathMustExist {
                }
                ValidationRuleBase < MetaEdGrammar.TargetPropertyPathContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        readonly: IPropertyPathLookup, _propertyPathLookup: ,
                        TargetPropertyPathMustExist(ISymbolTable = symbolTable, IPropertyPathLookup = propertyPathLookup) {
                            _symbolTable = symbolTable;
                            _propertyPathLookup = propertyPathLookup;
                        },
                        override: bool, IsValid(MetaEdGrammar, TargetPropertyPathContext = context) {
                            var entityContext = LookupParentEntityContext(context);
                            var propertyPathParts = context.propertyPath().PropertyPathParts();
                            return _propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, TargetPropertyPathContext = context) {
                            return string.Format("Path {0} is not valid or lists properties that are not part of the primary key.", context.GetText());
                        },
                        EntityContext: LookupParentEntityContext(MetaEdGrammar.TargetPropertyPathContext, context) };
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
                        // since the property has to be a PK, it must be defined on the base
                        return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
                    }
                    var domainEntitySubclassContext = definingEntityContext;
                    if (domainEntitySubclassContext != null) {
                        // since the property has to be a PK, it must be defined on the base
                        var domainEntity = _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
                        return domainEntity ?  ? _symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText()) :  : ;
                    }
                    var associationContext = definingEntityContext;
                    if (associationContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
                    }
                    var associationExtensionContext = definingEntityContext;
                    if (associationExtensionContext != null) {
                        return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
                    }
                    var associationSubclassContext = definingEntityContext;
                    if (associationSubclassContext != null) {
                        // since the property has to be a PK, it must be defined on the base
                        return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
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
//# sourceMappingURL=TargetPropertyPathMustExist.js.map