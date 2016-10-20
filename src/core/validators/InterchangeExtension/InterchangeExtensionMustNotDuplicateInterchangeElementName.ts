import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeExtensionMustNotDuplicateInterchangeElementName extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    private static duplicateInterchangeElements(context: MetaEdGrammar.InterchangeExtensionContext): string[] {
        let interchangeElements = context.interchangeExtensionComponent().interchangeElement().map(x => x.ID().getText());
        return interchangeElements.GroupBy(x => x).filter(group => group.Count() > 1).map(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        return InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        let identifier = context.extendeeName().getText();
        let duplicateInterchangeElements = InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange additions '${identifier}' declares duplicate interchange element{duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'`;
    }
}
