import { WorkspaceProject } from '@angular-devkit/core/src/workspace';
import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import * as ts from 'typescript';

export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    addModuleImportToRootModule(tree);
    addGlobalsToTarget('build', tree);
    addGlobalsToTarget('test', tree);
    return tree;
  };
}

/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(`Could not find the project main file inside of the ` +
        `workspace config (${project.sourceRoot})`);
  }

  return buildOptions.main;
}

/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
  if (project.architect &&
      project.architect[buildTarget] &&
      project.architect[buildTarget].options) {

    return project.architect[buildTarget].options;
  }

  throw new SchematicsException(
    `Cannot determine project target configuration for: ${buildTarget}.`);
}

/**
 * Adds AngularCesium module to the root module of the specified project.
 */
function addModuleImportToRootModule(host: Tree) {
  const workspace = getWorkspace(host);
  const project = workspace.projects[workspace.defaultProject];

  const modulePath = getAppModulePath(host, getProjectMainFile(project));
  const moduleSource = getSourceFile(host, modulePath);

  const changes = addImportToModule(moduleSource, modulePath, 'AngularCesiumModule.forRoot()', 'angular-cesium');
  const recorder = host.beginUpdate(modulePath);

  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);

  return host;
}

/**
 * Adds scripts, styles and assets to the workspace configuration file.
 */
function addGlobalsToTarget(targetName: 'test' | 'build', host: Tree) {
  const workspace = getWorkspace(host);
  const project = workspace.projects[workspace.defaultProject];
  const targetOptions = getProjectTargetOptions(project, targetName);

  addOrAppendGlobal(targetOptions.scripts, './node_modules/cesium/Build/Cesium/Cesium.js');
  addOrAppendGlobal(targetOptions.styles, './node_modules/cesium/Build/Cesium/Widgets/widgets.css');
  addOrAppendGlobal(targetOptions.assets,  {
    glob: '**/*',
    input: './node_modules/cesium/Build/Cesium',
    output: './assets/cesium'
  });

  host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}

function getWorkspace(host: Tree) {
  const workspaceConfig = host.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }

  return JSON.parse(workspaceConfig.toString());
}

function addOrAppendGlobal(section: any[], path: any) {
  if (!section) {
    section = [path];
  } else {
    section.unshift(path);
  }
}
