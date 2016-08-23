using;
System;
using;
System.Linq;
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
                bool;
                Validate(EntityContext, startingEntityContext, string[], propertyPath, Func < IPropertyWithComponents, bool > filter);
                IContextWithIdentifier;
                FindReferencedProperty(EntityContext, startingEntityContext, string[], propertyPath, Func < IPropertyWithComponents, bool > filter);
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
class PropertyPathLookup {
}
IPropertyPathLookup;
{
    readonly;
    ISymbolTable;
    _symbolTable;
    PropertyPathLookup(ISymbolTable, symbolTable);
    {
        _symbolTable = symbolTable;
    }
    Func < IPropertyWithComponents, bool > MatchAllIdentityProperties();
    {
        return propertyWithComponents => propertyWithComponents.propertyComponents().propertyAnnotation().identity() != null ||
            propertyWithComponents.propertyComponents().propertyAnnotation().identityRename() != null;
    }
    Func < IPropertyWithComponents, bool > MatchAllButFirstAsIdentityProperties();
    {
        var first = true;
        IPropertyWithComponents;
        firstComponent = null;
        return delegate(IPropertyWithComponents, components);
        {
            if (first) {
                first = false;
                firstComponent = components;
                return true;
            }
            if (firstComponent != null && firstComponent == components)
                return true;
            return components.propertyComponents().propertyAnnotation().identity() != null;
        }
        ;
    }
    bool;
    Validate(EntityContext, startingEntityContext, string[], propertyPath, Func < IPropertyWithComponents, bool > filter);
    {
        return FindReferencedProperty(startingEntityContext, propertyPath, filter) != null;
    }
    IContextWithIdentifier;
    FindReferencedProperty(EntityContext, startingEntityContext, string[], propertyPath, Func < IPropertyWithComponents, bool > filter);
    {
        var entityContext = startingEntityContext;
        string;
        entityName = null;
        IContextWithIdentifier;
        propertyContext = null;
        foreach();
        var propertyPathPart;
         in propertyPath;
        {
            if (entityContext == null) {
                var entityType = GetEntityType(entityName);
                if (entityType == null)
                    return null;
                entityContext = _symbolTable.Get(entityType, entityName);
            }
            var matchingProperties = entityContext.PropertySymbolTable.GetWithoutContext(propertyPathPart).Where(filter);
            if (!matchingProperties.Any()) {
                if (!FindAssociationDomainEntityProperty(entityContext, propertyPathPart, out, propertyContext))
                    return null;
            }
            else if (matchingProperties.Count() > 1) {
                return null;
            }
            else {
                propertyContext = matchingProperties.First();
            }
            if ((propertyContext))
                is;
            MetaEdGrammar.ReferencePropertyContext;
                || (propertyContext);
            is;
            MetaEdGrammar.FirstDomainEntityContext;
                || (propertyContext);
            is;
            MetaEdGrammar.SecondDomainEntityContext;
            entityName = propertyContext.IdNode().GetText();
            entityName = null;
            entityContext = null;
        }
        return propertyContext;
    }
    bool;
    FindAssociationDomainEntityProperty(EntityContext, entityContext, string, propertyNameToMatch, out, IContextWithIdentifier, property);
    {
        property = null;
        var associationContext = entityContext.Context;
        if (associationContext == null)
            return false;
        if (associationContext.firstDomainEntity().IdText() == propertyNameToMatch) {
            property = associationContext.firstDomainEntity();
        }
        else if (associationContext.secondDomainEntity().IdText() == propertyNameToMatch) {
            property = associationContext.secondDomainEntity();
        }
        else
            return false;
        return true;
    }
    string;
    GetEntityType(string, identifierToMatch);
    {
        var domainEntityType = SymbolTableEntityType.DomainEntityEntityType();
        if (_symbolTable.IdentifierExists(domainEntityType, identifierToMatch))
            return domainEntityType;
        var associationType = SymbolTableEntityType.AssociationEntityType();
        if (_symbolTable.IdentifierExists(associationType, identifierToMatch))
            return associationType;
        var abstractEntityType = SymbolTableEntityType.AbstractEntityEntityType();
        if (_symbolTable.IdentifierExists(abstractEntityType, identifierToMatch))
            return abstractEntityType;
        // since this is only being used to find properties that are part of the identity
        // we won't look for extensions and subclasses now
        return null;
    }
}
//# sourceMappingURL=PropertyPathLookup.js.map