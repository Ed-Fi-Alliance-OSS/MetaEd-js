using;
System;
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
                class MergePropertyAndTargetPropertyMustMatch {
                }
                ValidationRuleBase < MetaEdGrammar.MergePartOfReferenceContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        readonly: IPropertyPathLookup, _propertyPathLookup: ,
                        MergePropertyAndTargetPropertyMustMatch(ISymbolTable = symbolTable, IPropertyPathLookup = propertyPathLookup) {
                            _symbolTable = symbolTable;
                            _propertyPathLookup = propertyPathLookup;
                        },
                        override: bool, IsValid(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            var entityContext = LookupParentEntityContext(context);
                            var mergePropertyPathParts = context.mergePropertyPath().propertyPath().PropertyPathParts();
                            var targetPropertyPathParts = context.targetPropertyPath().propertyPath().PropertyPathParts();
                            var mergeProperty = _propertyPathLookup.FindReferencedProperty(entityContext, mergePropertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
                            var targetProperty = _propertyPathLookup.FindReferencedProperty(entityContext, targetPropertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
                            // let other rules check that the property actually has to exist
                            if (mergeProperty == null || targetProperty == null)
                                return true;
                            var mergePropertyType = mergeProperty.GetType();
                            var targetPropertyType = targetProperty.GetType();
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
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            return string.Format("The merge paths '{0}' and '{1}' do not correspond to the same entity type.", context.mergePropertyPath().GetText(), context.targetPropertyPath().GetText());
                        },
                        EntityContext: LookupParentEntityContext(MetaEdGrammar.MergePartOfReferenceContext, context) };
                {
                    // first parent - referenceProperty
                    // second parent - property collection
                    // third parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
                    var definingEntityContext = context.parent.parent.parent;
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
                bool;
                IsReferenceProperty(Type, type);
                {
                    return ((type == typeof (MetaEdGrammar.ReferencePropertyContext)) ||
                        (type == typeof (MetaEdGrammar.FirstDomainEntityContext)) ||
                        (type == typeof (MetaEdGrammar.SecondDomainEntityContext)));
                }
                bool;
                MatchBaseType(IContextWithIdentifier, referencingProperty, string, baseTypeName);
                {
                    var entityName = referencingProperty.IdNode().GetText();
                    EntityContext;
                    entityContext = null;
                    entityContext = _symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), entityName);
                    if (entityContext != null) {
                        var subclass = entityContext.Context;
                        return subclass.baseName().IdText() == baseTypeName;
                    }
                    entityContext = _symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), entityName);
                    if (entityContext != null) {
                        var subclass = entityContext.Context;
                        return subclass.baseName().IdText() == baseTypeName;
                    }
                    return false;
                }
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatch.js.map