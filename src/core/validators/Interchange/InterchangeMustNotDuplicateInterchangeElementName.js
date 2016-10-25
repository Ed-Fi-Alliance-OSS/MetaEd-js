import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeMustNotDuplicateInterchangeElementName extends ValidationRuleBase<MetaEdGrammar.InterchangeContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    private static duplicateInterchangeElements(context: MetaEdGrammar.InterchangeContext): string[] {
        let interchangeElements = context.interchangeComponent().interchangeElement().map(x => x.ID().getText());
        return interchangeElements.GroupBy(x => x).filter(group => group.Count() > 1).map(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
        return InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
        let identifier = context.interchangeName().getText();
        let duplicateInterchangeElements = InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange '${identifier}' declares duplicate interchange element${duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'.`;
    }
}
