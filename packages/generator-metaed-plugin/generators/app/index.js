// Written so it doesn't need transpiling on modern Node versions
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const semver = require('semver');
const chalk = require('chalk');

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Welcome to the MetaEd plugin generator!`));

    const prompts = [
      {
        type: 'input',
        name: 'packageJsonName',
        message: 'What is the NPM package name for your new plugin? (as "metaed-plugin-<organization name>-<plugin name>")',
        default: 'metaed-plugin-org-example',
        validate: async input => {
          if (typeof input !== 'string' || !input.startsWith('metaed-plugin-'))
            return 'NPM package name must start with "metaed-plugin-"';
          if (input.length > 214) return 'NPM package names are limited to 214 characters';
          if (!/^[a-z0-9-]+$/.test(input))
            return 'Organization names and plugin names are limited to lower case characters and numbers';
          const splitInputArray = input.split('-');
          if (splitInputArray.length !== 4 || splitInputArray[2].length === 0 || splitInputArray[3].length === 0)
            return 'There must be exactly one organization name and one plugin name';
          if (splitInputArray[2] === 'EdFi') return 'The "EdFi" organization name is reserved';
          return true;
        },
      },
      {
        type: 'input',
        name: 'packageJsonVersion',
        message: 'What is the NPM package version for your new plugin',
        default: '0.1.0',
        validate: async input =>
          semver.valid(input) ? true : 'Not a valid SemVer version -- see https://semver.org/ for examples',
      },
      {
        type: 'input',
        name: 'shortName',
        message: 'What is the short name for your new plugin? (abbreviated organization and plugin name, used in code)',
        default: 'orgExample',
        validate: async input => {
          if (typeof input !== 'string' || input.length < 4 || input.length > 64)
            return 'Short names must be between 4 and 64 characters in length';
          if (!/^[a-zA-Z]+$/.test(input)) return 'Short names are limited to upper and lower case characters';
          if (input.startsWith('EdFi')) return 'The "EdFi" organization name is reserved';
          return true;
        },
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'What is the name of the organization authoring the plugin?',
        default: 'My Org',
      },
      {
        type: 'input',
        name: 'metaEdVersion',
        message: 'What version range of MetaEd does your new plugin support? (in SemVer range format)',
        default: '2.x',
        validate: async input =>
          semver.validRange(input)
            ? true
            : 'Not a valid SemVer range -- see https://github.com/npm/node-semver for examples',
      },
      {
        type: 'input',
        name: 'technologyVersion',
        message: 'What version range of your target technology does your new plugin support? (in SemVer range format)',
        default: '*',
        validate: async input =>
          semver.validRange(input)
            ? true
            : 'Not a valid SemVer range -- see https://github.com/npm/node-semver for examples',
      },
      {
        type: 'checkbox',
        name: 'dependencies',
        message: 'Which Ed-Fi Alliance MetaEd plugins does your new plugin depend on?',
        default: ['metaed-plugin-edfi-unified-advanced'],
        choices: ['metaed-plugin-edfi-unified-advanced', 'metaed-plugin-edfi-ods-relational', 'metaed-plugin-edfi-xsd'],
      },
    ];

    this.props = await this.prompt(prompts);
  }

  async writing() {
    await this.fs.copy(this.templatePath('**/.*'), this.destinationRoot(), { dot: true });
    await this.fs.copy(this.templatePath('**/*'), this.destinationRoot());

    // create package.json from scratch
    const packageJson = {
      name: this.props.packageJsonName,
      main: 'dist/index.js',
      version: this.props.packageJsonVersion,
      files: ['/dist'],
      'metaed-plugin': {
        pluginType: 'artifact-specific',
        shortName: this.props.shortName,
        authorName: this.props.authorName,
        metaEdVersion: this.props.metaEdVersion,
        technologyVersion: this.props.technologyVersion,
        dependencies: this.props.dependencies,
      },
      publishConfig: {
        registry: 'https://www.myget.org/F/ed-fi/npm/',
      },
      dependencies: {
        handlebars: 'latest',
        'metaed-core': 'latest',
      },
      devDependencies: {
        '@types/jest': '^23.3.11',
        '@types/node': '^10.12.18',
        copyfiles: '^2.1.0',
        documentation: '8.1.2',
        eslint: '5.4.0',
        'eslint-config-airbnb-base': '^13.1.0',
        'eslint-config-prettier': '^3.0.1',
        'eslint-config-typescript': '^1.1.0',
        'eslint-plugin-import': '^2.14.0',
        'eslint-plugin-jasmine': '^2.10.1',
        'eslint-plugin-json': '^1.3.2',
        'eslint-plugin-prettier': '^2.6.2',
        'eslint-plugin-react': '^7.12.3',
        'eslint-plugin-typescript': '^1.0.0-rc.2',
        jest: '^24.5.0',
        prettier: '^1.14.2',
        rimraf: '^2.6.1',
        'ts-jest': '^23.10.5',
        'ts-node': '^7.0.1',
        typescript: '3.1.6',
        'typescript-eslint-parser': '^21.0.2',
      },
      scripts: {
        test: 'yarn test:lint && yarn test:unit',
        'test:lint': 'yarn test:ts && yarn test:eslint',
        'test:eslint': 'eslint --ext .js,.ts .',
        'test:ts': 'tsc -p . --noEmit',
        'test:unit': 'yarn build:clean && yarn jest .',
        build: 'yarn build:clean && yarn build:copy-non-ts && yarn build:dist',
        'build:clean': 'rimraf dist',
        'build:dist': 'tsc',
        'build:copy-non-ts': 'copyfiles -u 1 -e "**/*.ts" "src/**/*" dist --verbose',
      },
    };
    this.props.dependencies.forEach(dependency => {
      packageJson.dependencies[dependency] = 'latest';
    });

    await this.fs.writeJSON(this.destinationPath('package.json'), packageJson);

    // create .eslint files from scratch -- actual ones in template folder would interfere with MetaEd-js dev environment

    const templateLevelEslintRc = {
      parser: 'typescript-eslint-parser',
      extends: ['airbnb-base', 'prettier'],
      plugins: ['typescript', 'prettier'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.mjs', '.js', '.json', '.ts'],
          },
        },
        'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
      },
      rules: {
        'import/no-duplicates': 'off',
        'no-unused-vars': 'off',
        'typescript/no-unused-vars': 'off',
        'max-len': 'off',
        'no-await-in-loop': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': [
          2,
          {
            props: false,
          },
        ],
        'prettier/prettier': 'warn',
      },
    };

    await this.fs.writeJSON(this.destinationPath('.eslintrc'), templateLevelEslintRc);

    const testLevelEslintRc = {
      env: {
        jest: true,
      },
      rules: {
        'no-unused-expressions': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    };

    await this.fs.writeJSON(this.destinationPath('test/.eslintrc'), testLevelEslintRc);
  }

  install() {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true,
    });
  }

  end() {
    this.log(
      `Demonstrating ${chalk.yellow(
        'yarn test',
      )} script that runs Typescript type checking, ESLint, and Jest on plugin codebase.`,
    );
    this.spawnCommandSync('yarn', ['test']);

    this.log(`Demonstrating ${chalk.yellow('yarn build')} script that transpiles plugin codebase.`);
    this.spawnCommandSync('yarn', ['build']);
  }
};
