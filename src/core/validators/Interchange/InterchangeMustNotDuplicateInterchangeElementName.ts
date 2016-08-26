import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeMustNotDuplicateInterchangeElementName extends ValidationRuleBase<MetaEdGrammar.InterchangeContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    private static duplicateInterchangeElements(context: MetaEdGrammar.InterchangeContext): string[] {
        let interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
        return InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
        let identifier = context.interchangeName().GetText();
        let duplicateInterchangeElements = InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange '${identifier}' declares duplicate interchange element${duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'.`;
    }
}
