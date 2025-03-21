// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdErrorListener } from '../../src/grammar/MetaEdErrorListener';
import { buildTopLevelEntity, buildMetaEd } from '../../src/grammar/ParseTreeBuilder';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when parsing top level entities', (): void => {
  it('should parse with valid MetaEd', (): void => {
    const inputText = [
      'Domain Entity TestEntity',
      'documentation "This is the first line\nThis is more..."',
      '    integer MyProperty',
      '        documentation "Integer documentation"',
      '        is part of identity\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(0);
  });

  it('should not parse with extraneous xyz', (): void => {
    const inputText = [
      'Domain Entity TestEntity',
      'documentation "This is the first line\nThis is more..."',
      '    integer MyProperty xyz',
      '        documentation "Integer documentation"',
      '        is part of identity\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('should not parse with multiple keyword syntax errors', (): void => {
    const inputText = [
      'Domain Entity Staff additions\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
      'shared decimal ProfessionalDevelopment named NewTeacherClassroomManagementProfessionalDevelopment\n',
      'documentation "The number of days of professional development in classroom management that was provided by the district for new teacher."\n',
      'is optional\n',
      'shared decimal ProfessionalDevelopment named NewTeacherInstructionalDeliveryProfessionalDevelopment\n',
      'documentation "The number of days of professional development in instructional deliver (strategies) that was provided by the district for new teacher."\n',
      'is optional\n',
      'zcommvzxxon REPRaceOrder\n',
      'documentation "none provided"\n',
      'is optional collection\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(2);
    expect(validationFailures).toMatchSnapshot();
  });

  it('another example', (): void => {
    const inputText = [
      'Domain Entity Staff additions\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('and another example', (): void => {
    const inputText = [
      'Domain Entity Staff\n',
      'documentation "Something"\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('one more example', (): void => {
    const inputText = [
      'Domain Entity Staff\n',
      'documentation "Something"\n',
      'decscriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildTopLevelEntity(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });
});

describe('when parsing full MetaEd', (): void => {
  it('should parse with valid MetaEd', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity TestEntity',
      'documentation "This is the first line\nThis is more..."',
      '    integer MyProperty',
      '        documentation "Integer documentation"',
      '        is part of identity\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(0);
  });

  it('should not parse with extraneous xyz', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity TestEntity',
      'documentation "This is the first line\nThis is more..."',
      '    integer MyProperty xyz',
      '        documentation "Integer documentation"',
      '        is part of identity\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('should not parse with multiple keyword syntax errors', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity Staff additions\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
      'shared decimal ProfessionalDevelopment named NewTeacherClassroomManagementProfessionalDevelopment\n',
      'documentation "The number of days of professional development in classroom management that was provided by the district for new teacher."\n',
      'is optional\n',
      'shared decimal ProfessionalDevelopment named NewTeacherInstructionalDeliveryProfessionalDevelopment\n',
      'documentation "The number of days of professional development in instructional deliver (strategies) that was provided by the district for new teacher."\n',
      'is optional\n',
      'zcommvzxxon REPRaceOrder\n',
      'documentation "none provided"\n',
      'is optional collection\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(2);
    expect(validationFailures).toMatchSnapshot();
  });

  it('another example', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity Staff additions\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('and another example', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity Staff\n',
      'documentation "Something"\n',
      'descriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });

  it('one more example', (): void => {
    const inputText = [
      'Begin Namespace Extension EXTENSION',
      'Domain Entity Staff\n',
      'documentation "Something"\n',
      'decscriptor EducatorEffectiveness\n',
      'documentation "Indicates the educator effectiveness label as identified by the school district for each educator. The effectiveness labels should be based upon the employees most recent evaluation."\n',
      'is optional\n',
      'comvmon Recognition\n',
      'documentation "Recognition given to a staff member for accomplishments in a co-curricular, or extra-curricular activity."\n',
      'is optional collection\n',
      'End Namespace',
    ].join('\n');

    const validationFailures: ValidationFailure[] = [];
    const errorListener = new MetaEdErrorListener(validationFailures);
    buildMetaEd(errorListener, inputText);
    expect(validationFailures).toHaveLength(1);
    expect(validationFailures).toMatchSnapshot();
  });
});
