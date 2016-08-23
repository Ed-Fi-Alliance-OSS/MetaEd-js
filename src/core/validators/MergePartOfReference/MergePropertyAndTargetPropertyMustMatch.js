var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePropertyAndTargetPropertyMustMatch extends ValidationRuleBase {
                    constructor(symbolTable, propertyPathLookup) {
                        this._symbolTable = symbolTable;
                        this._propertyPathLookup = propertyPathLookup;
                    }
                    isValid(context) {
                        var entityContext = LookupParentEntityContext(context);
                        var mergePropertyPathParts = context.mergePropertyPath().propertyPath().PropertyPathParts();
                        var targetPropertyPathParts = context.targetPropertyPath().propertyPath().PropertyPathParts();
                        var mergeProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, mergePropertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
                        var targetProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, targetPropertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
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
                    }
                    getFailureMessage(context) {
                        return string.Format("The merge paths '{0}' and '{1}' do not correspond to the same entity type.", context.mergePropertyPath().GetText(), context.targetPropertyPath().GetText());
                    }
                    lookupParentEntityContext(context) {
                        var definingEntityContext = context.parent.parent.parent;
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
                    isReferenceProperty(type) {
                        return ((type == MetaEdGrammar.ReferencePropertyContext) || (type == MetaEdGrammar.FirstDomainEntityContext) || (type == MetaEdGrammar.SecondDomainEntityContext));
                    }
                    matchBaseType(referencingProperty, baseTypeName) {
                        var entityName = referencingProperty.IdNode().GetText();
                        var entityContext = null;
                        entityContext = this._symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), entityName);
                        if (entityContext != null) {
                            var subclass = __as__(entityContext.Context, MetaEdGrammar.DomainEntitySubclassContext);
                            return subclass.baseName().IdText() == baseTypeName;
                        }
                        entityContext = this._symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), entityName);
                        if (entityContext != null) {
                            var subclass = __as__(entityContext.Context, MetaEdGrammar.AssociationSubclassContext);
                            return subclass.baseName().IdText() == baseTypeName;
                        }
                        return false;
                    }
                }
                MergePartOfReference.MergePropertyAndTargetPropertyMustMatch = MergePropertyAndTargetPropertyMustMatch;
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatch.js.map