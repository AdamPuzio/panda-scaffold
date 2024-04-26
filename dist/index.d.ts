import { CommandInterface, Command } from '@panda/command';

declare class PandaFactory {
    __clone: boolean;
    _: {};
    mod: {
        kebabCase: (v: any) => any;
        dashCase: (v: any) => any;
        titleCase: (v: any) => any;
        camelCase: (v: any) => any;
        pascalCase: (v: any) => any;
        snakeCase: (v: any) => any;
        envCase: (v: any) => any;
        dotCase: (v: any) => any;
        pathCase: (v: any) => any;
        namespaceCase: (v: any) => any;
        sentenceCase: (v: any) => any;
        lowerCase: (v: any) => any;
        upperCase: (v: any) => any;
    };
    data: {};
    constructor(cfg?: any);
    clone(cfg: any): PandaFactory;
    render(str: any, data?: any): string;
    path(dir: any, data?: any): string;
    ensurePath(dir: any): string;
    fileExists(file: any): Promise<boolean>;
    list(dir: any, opts?: {}): Promise<any>;
    readFile(file: any): Promise<string>;
    /**
     * Write contents to a file
     *
     * @param file                file to write to
     * @param output              contents to write to file
     * @param opts
     * @param opts.force          flag to forcefully write to the file even if the file already exists
     * @param opts.skipIfExists   flag to skip the file if it exists
     * @param opts.encoding       encoding of file
     * @returns
     */
    writeFile(file: any, output: any, opts?: any): Promise<void>;
    readJsonFile(file: any): Promise<any>;
    writeJsonFile(file: any, json: any): Promise<void>;
    openBrowser(url: any): void;
    /**
     * Runs a command
     *
     * @param {String} cmd              command to run
     * @param {Object} opts             options
     * @param {boolean} opts.stream     stream output
     * @returns
     */
    runCommand(cmd: any, opts: any): Promise<any>;
}
declare const Factory: PandaFactory;

interface ScaffoldProps extends CommandInterface {
    scaffoldDir?: string;
    actions?: ScaffoldActionProps[];
    actionTypes?: any[];
}
interface ScaffoldActionProps {
    type: string;
    source?: string;
    target?: string;
    [key: string]: any;
}
interface ScaffoldActionTypeProps {
}
interface FactoryCloneConfig {
    cwd: string;
    _source?: string;
    _target?: string;
    source?: string;
    target?: string;
    data?: {
        [key: string]: any;
    };
}

declare class ScaffoldAction {
    _type: string;
    name: string;
    description: string;
    sourceBase?: string;
    source?: string;
    target?: string;
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    constructor(cfg: any);
    run(action: any, data: any, factory: any): Promise<void>;
}

declare class ScaffoldActionAdd extends ScaffoldAction {
    name: string;
    run(action: any, data: any, factory: any): Promise<void>;
}

declare class ScaffoldActionAddMany extends ScaffoldAction {
    name: string;
    description: string;
    startMessage: string;
    run(action: any, data: any, factory: any): Promise<void>;
}

declare class ScaffoldActionContext extends ScaffoldAction {
    name: string;
    description: string;
    factory: any;
    run(action: any, data: any, factory: any): Promise<void>;
    inPanda(): Promise<void>;
    inProject(cwd: any): Promise<void>;
    inPandaProject(cwd: any): Promise<void>;
    getPackageJson(cwd: any, onError?: string): Promise<any>;
}

declare class ScaffoldActionCustom extends ScaffoldAction {
    name: string;
    description: string;
    run(action: any, data: any, factory: any): Promise<any>;
}

declare class ScaffoldActionModify extends ScaffoldAction {
    name: string;
    run(action: any, data: any, factory: any): Promise<void>;
}

declare class Scaffold extends Command {
    scaffoldDir: string;
    cwd: string;
    actions: any[];
    actionTypes: {};
    _actionTypes: {
        add: typeof ScaffoldActionAdd;
        addMany: typeof ScaffoldActionAddMany;
        context: typeof ScaffoldActionContext;
        custom: typeof ScaffoldActionCustom;
        modify: typeof ScaffoldActionModify;
    };
    mod: {
        kebabCase: (v: any) => any;
        dashCase: (v: any) => any;
        titleCase: (v: any) => any;
        camelCase: (v: any) => any;
        pascalCase: (v: any) => any;
        snakeCase: (v: any) => any;
        envCase: (v: any) => any;
        dotCase: (v: any) => any;
        pathCase: (v: any) => any;
        namespaceCase: (v: any) => any;
        sentenceCase: (v: any) => any;
        lowerCase: (v: any) => any;
        upperCase: (v: any) => any;
    };
    constructor(cfg: ScaffoldProps);
    registerActionTypes(actionTypes?: {}): void;
    /**
     * Method to trigger once processed
     *
     * @param {object} data       raw data object
     * @param {object} details    complete object of parsed data
     */
    action(data: any, details: any): Promise<void>;
    runActions(data: any): Promise<void>;
    runAction(action: any, data: any): Promise<void>;
}

export { Factory, type FactoryCloneConfig, Scaffold, ScaffoldAction, ScaffoldActionAdd, ScaffoldActionAddMany, ScaffoldActionContext, ScaffoldActionCustom, ScaffoldActionModify, type ScaffoldActionProps, type ScaffoldActionTypeProps, type ScaffoldProps };
