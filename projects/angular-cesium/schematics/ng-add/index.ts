import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';
import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import * as ts from 'typescript';

export function ngAdd(_options: any): Rule {
  return (_: Tree, _context: SchematicContext) => {
    return chain([
      addModuleImportToRootModule(),
      addGlobalsToTarget('build'),
      addGlobalsToTarget('test'),
      updateMain(),
      updateStyles(),
      addTypings(),
      installPackageJsonDependencies()
    ]);
  };
}

function addTypings(): Rule {
  return (tree: Tree) => {
    if (!tree.exists('./src/typing.d.ts')) {
      tree.create('./src/typing.d.ts', 'declare var Cesium;');
    } else {
      const recorder = tree.beginUpdate('./src/typing.d.ts');
      recorder.insertLeft(0, 'declare var Cesium;\n');
      tree.commitUpdate(recorder);
    }
    return tree;
  };
}

function updateStyles(): Rule {
  return (tree: Tree) => {
    let stylesPath;

    if (tree.exists('./src/styles.css')) {
      stylesPath = './src/styles.css';
    } else if (tree.exists('./src/styles.scss')) {
      stylesPath = './src/styles.scss';
    } else if (tree.exists('./src/styles.less')) {
      stylesPath = './src/styles.less';
    } else if (tree.exists('./src/styles.styl')) {
      stylesPath = './src/styles.styl';
    } else {
      return;
    }

    const insertion =
      '\nhtml, body {\n  margin: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.map-container {\n  width: 100%;\n  height: 100%;\n' +
      '  overflow: hidden;\n  position: relative;\n}\n';
    const recorder = tree.beginUpdate(stylesPath);
    recorder.insertRight(0, insertion);
    tree.commitUpdate(recorder);

    console.log('');

    return tree;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.addTask(new NodePackageInstallTask({packageName: 'cesium'}));
    return host;
  };
}

/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(
    path,
    buffer.toString(),
    ts.ScriptTarget.Latest,
    true
  );
}

/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project: WorkspaceProject): string {
  const buildOptions = getProjectTargetOptions(project, 'build');

  if (!buildOptions.main) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` +
        `workspace config (${project.sourceRoot})`
    );
  }

  return buildOptions.main;
}

/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(
  project: WorkspaceProject,
  buildTarget: string
) {
  if (
    project.architect &&
    project.architect[buildTarget] &&
    project.architect[buildTarget].options
  ) {
    return project.architect[buildTarget].options;
  }

  throw new SchematicsException(
    `Cannot determine project target configuration for: ${buildTarget}.`
  );
}

/**
 * Adds AngularCesium module to the root module of the specified project.
 */
function addModuleImportToRootModule() {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = workspace.projects[workspace.defaultProject];

    const modulePath = getAppModulePath(tree, getProjectMainFile(project));
    const moduleSource = getSourceFile(tree, modulePath);

    const changes = addImportToModule(
      moduleSource,
      modulePath,
      'AngularCesiumModule.forRoot()',
      'angular-cesium'
    ).concat(
      addImportToModule(
        moduleSource,
        modulePath,
        'AngularCesiumWidgetsModule',
        'angular-cesium'
      )
    );
    const recorder = tree.beginUpdate(modulePath);

    changes.forEach(change => {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    });

    tree.commitUpdate(recorder);

    return tree;
  };
}

/**
 * Adds scripts, styles and assets to the workspace configuration file.
 */
function addGlobalsToTarget(targetName: 'test' | 'build') {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = workspace.projects[workspace.defaultProject];
    const targetOptions = getProjectTargetOptions(project, targetName);

    addOrAppendGlobal(
      targetOptions.scripts,
      './node_modules/cesium/Build/Cesium/Cesium.js'
    );
    addOrAppendGlobal(
      targetOptions.styles,
      './node_modules/cesium/Build/Cesium/Widgets/widgets.css'
    );
    addOrAppendGlobal(targetOptions.assets, {
      glob: '**/*',
      input: './node_modules/cesium/Build/Cesium',
      output: './assets/cesium'
    });

    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));
  };
}

function getWorkspace(host: Tree) {
  const workspaceConfig = host.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException(
      'Could not find Angular workspace configuration'
    );
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

function updateMain() {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = workspace.projects[workspace.defaultProject];
    const mainFile = getProjectMainFile(project);

    const buffer = tree.read(mainFile);
    if (!buffer) {
      throw new SchematicsException(
        `Could not find file for path: ${mainFile}`
      );
    }

    const tsContent = buffer.toString();
    const insertion =
      '\nCesium.buildModuleUrl.setBaseUrl(\'/assets/cesium/\');\n//Cesium.Ion.defaultAccessToken="";\n';
    const recorder = tree.beginUpdate(mainFile);
    const bootstrapIndex = tsContent.indexOf(
      'platformBrowserDynamic().bootstrapModule(AppModule)'
    );
    recorder.insertLeft(bootstrapIndex - 1, insertion);
    tree.commitUpdate(recorder);
  };
}
