import chai from 'chai';
import MetaEdTextBuilder from '../../grammar/MetaEdTextBuilder';
import SymbolTableTestHelper from './SymbolTableTestHelper';

chai.should();

const entityName = 'EntityName';
const propertyName = 'PropertyName';
const doc = 'doc';
const prop = 'prop';
const edfi = 'edfi';

describe('SymbolTableBuilderEntityTests', () => {
  describe('When_loading_domain_entity', () => {
    const symbolTableKey = 'Domain Entity';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntity(entityName)
      .withMetaEdId('100')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_symbol_table', () => {
      const entityContext = helper.symbolTable.get(symbolTableKey, entityName);
      entityContext.should.not.be.empty;
      entityContext.name.should.equal(entityName);
      entityContext.context.should.not.be.empty;
    });
  });

  describe('When_loading_duplicate_domain_entity', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntity(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
    it('should_report_position_of_error', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.concatenatedLineNumber.should.equal(9);
      failure.characterPosition.should.equal(16);
      failure.tokenText.should.equal(entityName);
    });
  });

  describe('When_loading_abstract_entity', () => {
    const symbolTableKey = 'Abstract Entity';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAbstractEntity(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_abstract_entity', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAbstractEntity(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAbstractEntity()

      .withStartAbstractEntity(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_association', () => {
    const symbolTableKey = 'Association';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociation(entityName)
      .withDocumentation(doc)
      .withAssociationDomainEntityProperty('DomainEntity1', 'documentation for domain entity 1')
      .withAssociationDomainEntityProperty('DomainEntity2', 'documentation for domain entity 2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_association', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociation(entityName)
      .withDocumentation(doc)
      .withAssociationDomainEntityProperty('DomainEntity1', 'documentation for domain entity 1')
      .withAssociationDomainEntityProperty('DomainEntity2', 'documentation for domain entity 2')
      .withEndAssociation()

      .withStartAssociation(entityName)
      .withDocumentation(doc)
      .withAssociationDomainEntityProperty('DomainEntity3', 'documentation for domain entity 3')
      .withAssociationDomainEntityProperty('DomainEntity4', 'documentation for domain entity 4')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_association_extension', () => {
    const symbolTableKey = 'Associationadditions';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociationExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_association_extension', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociationExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationExtension()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_association_subclass', () => {
    const symbolTableKey = 'Associationbased on';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociationSubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_association_subclass', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartAssociationSubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationSubclass()

      .withStartAssociationSubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_choice', () => {
    const symbolTableKey = 'Choice';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartChoice(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndChoice()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_choice', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartChoice(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndChoice()

      .withStartChoice(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndChoice()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_shared_decimal', () => {
    const symbolTableKey = 'Shared Decimal';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedDecimal(entityName)
      .withDocumentation(doc)
      .withTotalDigits(10)
      .withDecimalPlaces(5)
      .withEndSharedDecimal()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_common_decimal', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedDecimal(entityName)
      .withDocumentation(doc)
      .withTotalDigits(10)
      .withDecimalPlaces(5)
      .withEndSharedDecimal()

      .withStartSharedDecimal(entityName)
      .withDocumentation(doc)
      .withTotalDigits(10)
      .withDecimalPlaces(5)
      .withEndSharedDecimal()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_shared_integer', () => {
    const symbolTableKey = 'Shared Integer';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedInteger(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_shared_integer', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedInteger(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedInteger()

      .withStartSharedInteger(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_shared_short', () => {
    const symbolTableKey = 'Shared Short';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedShort(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_shared_short', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedShort(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedShort()

      .withStartSharedShort(entityName)
      .withDocumentation(doc)
      .withMinValue(0)
      .withMaxValue(100)
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_shared_string', () => {
    const symbolTableKey = 'Shared String';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedString(entityName)
      .withDocumentation(doc)
      .withMinLength(0)
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_shared_string', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartSharedString(entityName)
      .withDocumentation(doc)
      .withMinLength(0)
      .withMaxLength(100)
      .withEndSharedString()

      .withStartSharedString(entityName)
      .withDocumentation(doc)
      .withMinLength(0)
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_common', () => {
    const symbolTableKey = 'Common';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_common', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndCommon()

      .withStartCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_descriptor', () => {
    const symbolTableKey = 'Descriptor';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDescriptor(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_descriptor', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDescriptor(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDescriptor()

      .withStartDescriptor(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_domain_entity_extension', () => {
    const symbolTableKey = 'Domain Entityadditions';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_domain_entity_extension', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_domain_entity_subclass', () => {
    const symbolTableKey = 'Domain Entitybased on';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntitySubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_domain_entity_subclass', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartDomainEntitySubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntitySubclass()

      .withStartDomainEntitySubclass(entityName, 'Original')
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_enumeration', () => {
    const symbolTableKey = 'Enumeration';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartEnumeration(entityName)
      .withDocumentation(doc)
      .withEnumerationItem(propertyName, prop)
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_enumeration', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartEnumeration(entityName)
      .withDocumentation(doc)
      .withEnumerationItem(propertyName, 'some optional documentation')
      .withEndEnumeration()

      .withStartEnumeration(entityName)
      .withDocumentation(doc)
      .withEnumerationItem(propertyName, 'some optional documentation')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_inline_common', () => {
    const symbolTableKey = 'Inline Common';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartInlineCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_inline_common', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartInlineCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndInlineCommon()

      .withStartInlineCommon(entityName)
      .withDocumentation(doc)
      .withBooleanProperty(propertyName, prop, true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });

  describe('When_loading_interchange', () => {
    const symbolTableKey = 'Interchange';
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartInterchange(entityName)
      .withDocumentation(doc)
      .withDomainEntityElement(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_load_into_symbol_table', () => {
      helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
    });
  });

  describe('When_loading_duplicate_interchange', () => {
    const helper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(edfi)
      .withStartInterchange(entityName)
      .withDocumentation(doc)
      .withDomainEntityElement(propertyName)
      .withEndInterchange()

      .withStartInterchange(entityName)
      .withDocumentation(doc)
      .withDomainEntityElement(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('should_report_the_duplicate', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.contain(entityName);
      failure.message.should.contain('Duplicate');
    });
  });
});
