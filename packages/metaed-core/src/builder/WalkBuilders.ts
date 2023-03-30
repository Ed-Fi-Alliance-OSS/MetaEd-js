import antlr4 from '@edfi/antlr4';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { State } from '../State';
import { nextMacroTask } from '../Utility';
import { AssociationBuilder } from './AssociationBuilder';
import { AssociationExtensionBuilder } from './AssociationExtensionBuilder';
import { AssociationSubclassBuilder } from './AssociationSubclassBuilder';
import { ChoiceBuilder } from './ChoiceBuilder';
import { CommonBuilder } from './CommonBuilder';
import { CommonExtensionBuilder } from './CommonExtensionBuilder';
import { CommonSubclassBuilder } from './CommonSubclassBuilder';
import { DecimalTypeBuilder } from './DecimalTypeBuilder';
import { DescriptorBuilder } from './DescriptorBuilder';
import { DomainBuilder } from './DomainBuilder';
import { DomainEntityBuilder } from './DomainEntityBuilder';
import { DomainEntityExtensionBuilder } from './DomainEntityExtensionBuilder';
import { DomainEntitySubclassBuilder } from './DomainEntitySubclassBuilder';
import { EnumerationBuilder } from './EnumerationBuilder';
import { IntegerTypeBuilder } from './IntegerTypeBuilder';
import { InterchangeBuilder } from './InterchangeBuilder';
import { NamespaceBuilder } from './NamespaceBuilder';
import { SharedDecimalBuilder } from './SharedDecimalBuilder';
import { SharedIntegerBuilder } from './SharedIntegerBuilder';
import { SharedStringBuilder } from './SharedStringBuilder';
import { StringTypeBuilder } from './StringTypeBuilder';

import { SyntaxValidatingBuilder } from './SyntaxValidatingBuilder';

export async function execute(state: State): Promise<void> {
  const builders: MetaEdGrammarListener[] = [
    // NamespaceBuilder goes first, all others have a dependency on it
    new NamespaceBuilder(state.metaEd, state.validationFailure),

    new AssociationBuilder(state.metaEd, state.validationFailure),
    new AssociationExtensionBuilder(state.metaEd, state.validationFailure),
    new AssociationSubclassBuilder(state.metaEd, state.validationFailure),
    new ChoiceBuilder(state.metaEd, state.validationFailure),
    new CommonBuilder(state.metaEd, state.validationFailure),
    new CommonExtensionBuilder(state.metaEd, state.validationFailure),
    new CommonSubclassBuilder(state.metaEd, state.validationFailure),
    new DecimalTypeBuilder(state.metaEd, state.validationFailure),
    new DescriptorBuilder(state.metaEd, state.validationFailure),
    new DomainBuilder(state.metaEd, state.validationFailure),
    new DomainEntityBuilder(state.metaEd, state.validationFailure),
    new DomainEntityExtensionBuilder(state.metaEd, state.validationFailure),
    new DomainEntitySubclassBuilder(state.metaEd, state.validationFailure),
    new EnumerationBuilder(state.metaEd, state.validationFailure),
    new IntegerTypeBuilder(state.metaEd, state.validationFailure),
    new InterchangeBuilder(state.metaEd, state.validationFailure),
    new SharedDecimalBuilder(state.metaEd, state.validationFailure),
    new SharedIntegerBuilder(state.metaEd, state.validationFailure),
    new SharedStringBuilder(state.metaEd, state.validationFailure),
    new StringTypeBuilder(state.metaEd, state.validationFailure),

    new SyntaxValidatingBuilder(state.metaEd, state.validationFailure),
  ];
  const parseTreeWalker = new antlr4.tree.ParseTreeWalker();

  // eslint-disable-next-line no-restricted-syntax
  for (const builder of builders) {
    parseTreeWalker.walk(builder, state.parseTree);
    await nextMacroTask();
  }
}
