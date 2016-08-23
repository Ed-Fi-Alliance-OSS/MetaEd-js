using System;
using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MergePartOfReference {
    public interface IPropertyPathLookup {
        bool Validate(EntityContext startingEntityContext, string[] propertyPath, Func < IPropertyWithComponents, bool > filter);
    IContextWithIdentifier FindReferencedProperty(EntityContext startingEntityContext, string[] propertyPath, Func < IPropertyWithComponents, bool > filter);
}

public class PropertyPathLookup : IPropertyPathLookup
{
        private readonly ISymbolTable _symbolTable;

        public PropertyPathLookup(ISymbolTable symbolTable)
    {
        _symbolTable = symbolTable;
    }

        public static Func < IPropertyWithComponents, bool > MatchAllIdentityProperties()
    {
        return propertyWithComponents => propertyWithComponents.propertyComponents().propertyAnnotation().identity() != null ||
            propertyWithComponents.propertyComponents().propertyAnnotation().identityRename() != null;
    }

        public static Func < IPropertyWithComponents, bool > MatchAllButFirstAsIdentityProperties()
    {
        var first = true;
        IPropertyWithComponents firstComponent = null;

        return delegate(IPropertyWithComponents components) { 
            if (first) {
                first = false;
                firstComponent = components;
                return true;
            }

            if (firstComponent != null && firstComponent == components)
                return true;

            return components.propertyComponents().propertyAnnotation().identity() != null;
        };
    }
        
        public bool Validate(EntityContext startingEntityContext, string[] propertyPath, Func < IPropertyWithComponents, bool > filter)
    {
        return FindReferencedProperty(startingEntityContext, propertyPath, filter) != null;
    }

        public IContextWithIdentifier FindReferencedProperty(EntityContext startingEntityContext, string[] propertyPath, Func < IPropertyWithComponents, bool > filter)
    {
        var entityContext = startingEntityContext;
        string entityName = null;
        IContextWithIdentifier propertyContext = null;

        foreach(var propertyPathPart in propertyPath)
        {
            if (entityContext == null) {
                var entityType = GetEntityType(entityName);
                if (entityType == null)
                    return null;

                entityContext = _symbolTable.Get(entityType, entityName);
            }

            var matchingProperties = entityContext.PropertySymbolTable.GetWithoutContext(propertyPathPart).Where(filter);
            if (!matchingProperties.Any()) {
                if (!FindAssociationDomainEntityProperty(entityContext, propertyPathPart, out propertyContext))
                    return null;
            }
            else if (matchingProperties.Count() > 1) {
                return null;
            }
            else {
                propertyContext = matchingProperties.First();
            }

            if ((propertyContext is MetaEdGrammar.ReferencePropertyContext)
                    || (propertyContext is MetaEdGrammar.FirstDomainEntityContext)
                    || (propertyContext is MetaEdGrammar.SecondDomainEntityContext))
            entityName = propertyContext.IdNode().GetText();
                else
            entityName = null;

            entityContext = null;
        }

        return propertyContext;
    }

        private bool FindAssociationDomainEntityProperty(EntityContext entityContext, string propertyNameToMatch, out IContextWithIdentifier property)
    {
        property = null;
        var associationContext = entityContext.Context as MetaEdGrammar.AssociationContext;
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
        
        private string GetEntityType(string identifierToMatch)
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
}