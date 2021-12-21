import R from 'ramda';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import chalk from 'chalk';
import klawSync from 'klaw-sync';
import { MetaEdProjectPathPairs } from './ProjectTypes';
import { deriveNamespaceFromProjectName } from './ProjectTypes';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

function findDirectories(directory: string): string[] {
  try {
    return klawSync(directory, { nofile: true }).map((x) => x.path);
  } catch (err) {
    winston.error(`ProjectLoader: Attempted to find directories in ${directory} failed due to issue: ${err.message}`);
  }
  return [];
}

async function findProjects(directories: string | string[]): Promise<MetaEdProjectPathPairs[]> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(directories)) directories = [directories];

  const projects: MetaEdProjectPathPairs[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const directory of directories) {
    const packageToTry: string = path.join(directory, 'package.json');

    try {
      if (await fs.pathExists(packageToTry)) {
        const json = await fs.readJson(packageToTry);

        if (json != null && json.metaEdProject != null) {
          projects.push({ path: directory, project: { ...json.metaEdProject, description: json.description || '' } });
        }
      }
    } catch (err) {
      winston.error(`ProjectLoader: Attempted load of ${packageToTry} failed due to issue: ${err.message}`);
    }
  }
  projects.forEach((p: MetaEdProjectPathPairs) => {
    p.project.namespaceName = deriveNamespaceFromProjectName(p.project.projectName) || '';
  });

  return projects;
}

export function overrideProjectNameAndNamespace(projects: MetaEdProjectPathPairs[], projectNameOverrides: string[]) {
  if (projectNameOverrides == null) return projects;
  if (projectNameOverrides.length > projects.length) return projects;

  projectNameOverrides.forEach((projectName: string, index: number) => {
    if (projects[index].project.projectName === projectName) return;

    const namespaceName = deriveNamespaceFromProjectName(projectName) || '';
    winston.info(`Overriding projectName: ${projects[index].project.projectName} ${chalk.red('->')} ${projectName}`);
    winston.info(`Overriding namespaceName: ${projects[index].project.namespaceName} ${chalk.red('->')} ${namespaceName}`);

    projects[index].project.projectName = projectName;
    projects[index].project.namespaceName = namespaceName;
  });
  return projects;
}

// Scans the immediate directory then subdirectories for package.json with metaEdProject property
export async function scanForProjects(
  directories: string | string[],
  projectNameOverrides: string[],
): Promise<MetaEdProjectPathPairs[]> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(directories)) directories = [directories];

  const projects: MetaEdProjectPathPairs[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const directory of directories) {
    projects.push(...(await findProjects(directory)));

    if (projects.length === 0) {
      const subdirectories: string[] = findDirectories(directory);

      if (subdirectories) projects.push(...(await findProjects(subdirectories)));
    }
  }

  const projectNameOverrideProjects: MetaEdProjectPathPairs[] = overrideProjectNameAndNamespace(
    projects,
    projectNameOverrides,
  );

  // core first, then extensions in alphabetical order
  const sortedProjects = R.sortWith([
    R.descend(R.pathEq(['project', 'projectName'], 'EdFi')),
    R.ascend(R.path(['project', 'projectName'])),
  ])(projectNameOverrideProjects);

  // only projects with unique namespace values
  return R.uniqBy(R.path(['project', 'projectName']))(sortedProjects);
}
