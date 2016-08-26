import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let anyIdentityRenames = context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        if (!anyIdentityRenames)
            return true;
        let baseIdentifier = context.baseName().GetText();
        let baseSymbolTable = this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        return baseSymbolTable.PropertySymbolTable.Values().Count(v => v.propertyComponents().propertyAnnotation().identity() != null) <= 1;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        return `Domain Entity '${identifier}' based on '${baseIdentifier}' is invalid for identity rename because parent entity '${baseIdentifier}' has more than one identity property.`;
    }
}
