import {EntityContext} from '../SymbolTable'
import {IPropertyWithComponents} from '../../../grammar/IPropertyWithComponents'
import {IContextWithIdentifier} from '../../../grammar/IContextWithIdentifier'
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'

export interface IPropertyPathLookup {
    validate(startingEntityContext: EntityContext, propertyPath: string[], filter: (prop: IPropertyWithComponents) => boolean): boolean;
    findReferencedProperty(startingEntityContext: EntityContext, propertyPath: string[], filter: (prop: IPropertyWithComponents) => boolean): IContextWithIdentifier;
}

export class PropertyPathLookup implements IPropertyPathLookup {
    private symbolTable: ISymbolTable;
    private symbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        this.symbolTable = symbolTable;
    }

    public validate(startingEntityContext: EntityContext, propertyPath: string[], filter: (prop: IPropertyWithComponents) => boolean): boolean {
        return this.findReferencedProperty(startingEntityContext, propertyPath, filter) != null;
    }

    public findReferencedProperty(startingEntityContext: EntityContext, propertyPath: string[], filter: (prop: IPropertyWithComponents) => boolean): IContextWithIdentifier {
        let entityContext = startingEntityContext;
        let entityName: string = null;
        let propertyContext: IContextWithIdentifier = null;

        for (let propertyPathPart of propertyPath) {
            if (entityContext == null) {
                let entityType = this.getEntityType(entityName);
                if (entityType == null)
                    return null;

                entityContext = this.symbolTable.get(entityType, entityName);
            }

            let matchingProperties = entityContext.propertySymbolTable.getWithoutContext(propertyPathPart).Where(filter);
            if (!matchingProperties.Any()) {
                if (!this.findAssociationDomainEntityProperty(entityContext, propertyPathPart, /*out*/ propertyContext))
                    return null;
            }
            else if (matchingProperties.Count() > 1) {
                return null;
            }
            else {
                propertyContext = matchingProperties.First();
            }

            //   if ((propertyContext is MetaEdGrammar.ReferencePropertyContext)
            //         || (propertyContext is MetaEdGrammar.FirstDomainEntityContext)
            //         || (propertyContext is MetaEdGrammar.SecondDomainEntityContext))
            //   entityName = propertyContext.idNode().GetText();
            //     else
            entityName = null;

            entityContext = null;
        }

        return propertyContext;
    }

    private findAssociationDomainEntityProperty(entityContext: EntityContext, propertyNameToMatch: string, /*out*/  property: IContextWithIdentifier): bool {
        property = null;
        var associationContext = entityContext.context as MetaEdGrammar.AssociationContext;
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

    private getEntityType(identifierToMatch: string): string {
        var domainEntityType = this.symbolTableEntityType.domainEntityEntityType();
        if (this.symbolTable.identifierExists(domainEntityType, identifierToMatch))
            return domainEntityType;

        var associationType = this.symbolTableEntityType.associationEntityType();
        if (this.symbolTable.identifierExists(associationType, identifierToMatch))
            return associationType;

        var abstractEntityType = this.symbolTableEntityType.abstractEntityEntityType();
        if (this.symbolTable.identifierExists(abstractEntityType, identifierToMatch))
            return abstractEntityType;

        // since this is only being used to find properties that are part of the primary key
        // we won't look for extensions and subclasses now

        return null;
    }
}