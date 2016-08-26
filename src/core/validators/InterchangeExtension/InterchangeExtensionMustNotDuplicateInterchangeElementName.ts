import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeExtensionMustNotDuplicateInterchangeElementName extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    private static duplicateInterchangeElements(context: MetaEdGrammar.InterchangeExtensionContext): string[] {
        let interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        return InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        let identifier = context.extendeeName().GetText();
        let duplicateInterchangeElements = InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange additions '${identifier}' declares duplicate interchange element{duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'`;
    }
}
