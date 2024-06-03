import { CommandProps, Command } from '@panda/command';

interface ScaffoldProps extends CommandProps {
    scaffoldDir?: string;
    cwd?: string;
    tasks?: ScaffoldActionProps[];
    actionTypes?: {
        [key: string]: any;
    };
    title?: string;
}
interface ScaffoldActionProps {
    type: string;
    source?: string;
    target?: string;
    [key: string]: any;
}
interface ScaffoldTaskProps {
    type: string;
    title?: string;
    source?: string;
    target?: string;
    successMessage?: string;
    failureMessage?: string;
    [key: string]: any;
}
interface FactoryCloneConfig {
    sourceBase?: string;
    targetBase?: string;
    _source?: string;
    _target?: string;
    source?: string;
    target?: string;
    data?: {
        [key: string]: any;
    };
}

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
    render(str: string, data?: {}): string;
    path(dir: string, data?: any): string;
    ensurePath(dir: any): string;
    fileExists(file: any): Promise<boolean>;
    list(dir: any, opts?: {}): Promise<string[]>;
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
    isGlob: (str: any) => boolean;
    isDir: (dir: any) => boolean;
    isFile: (file: any) => boolean;
    openBrowser(url: any): void;
    /**
     * Runs a command
     *
     * @param {String} cmd              command to run
     * @param {Object} opts             options
     * @param {boolean} opts.stream     stream output
     * @returns
     */
    runCommand(cmd: any, { stream }?: {
        stream?: boolean;
    }): Promise<any>;
}
declare const Factory: PandaFactory;

declare class ScaffoldAction {
    __type: string;
    static name: string;
    static description: string;
    sourceBase?: string;
    source?: string;
    targetBase?: string;
    target?: string;
    data: {
        [key: string]: any;
    };
    startMessage?: string;
    successMessage?: string;
    failureMessage?: string;
    silent?: boolean;
    constructor(cfg: any);
    init(cfg: any): this;
    trigger(data: any, cfg?: {}, opts?: {
        force: boolean;
    }): Promise<void>;
    run(data: any, ctx?: any): Promise<void>;
    when(data: any): Promise<boolean> | boolean;
    _factory?: typeof Factory;
    get factory(): {
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
        clone(cfg: any): any;
        render(str: string, data?: {}): string;
        path(dir: string, data?: any): string;
        ensurePath(dir: any): string;
        fileExists(file: any): Promise<boolean>;
        list(dir: any, opts?: {}): Promise<string[]>;
        readFile(file: any): Promise<string>;
        writeFile(file: any, output: any, opts?: any): Promise<void>;
        readJsonFile(file: any): Promise<any>;
        writeJsonFile(file: any, json: any): Promise<void>;
        isGlob: (str: any) => boolean;
        isDir: (dir: any) => boolean;
        isFile: (file: any) => boolean;
        openBrowser(url: any): void;
        runCommand(cmd: any, { stream }?: {
            stream?: boolean;
        }): Promise<any>;
    };
    set factory(factory: {
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
        clone(cfg: any): any;
        render(str: string, data?: {}): string;
        path(dir: string, data?: any): string;
        ensurePath(dir: any): string;
        fileExists(file: any): Promise<boolean>;
        list(dir: any, opts?: {}): Promise<string[]>;
        readFile(file: any): Promise<string>;
        writeFile(file: any, output: any, opts?: any): Promise<void>;
        readJsonFile(file: any): Promise<any>;
        writeJsonFile(file: any, json: any): Promise<void>;
        isGlob: (str: any) => boolean;
        isDir: (dir: any) => boolean;
        isFile: (file: any) => boolean;
        openBrowser(url: any): void;
        runCommand(cmd: any, { stream }?: {
            stream?: boolean;
        }): Promise<any>;
    });
    setPaths(data: any): void;
    process(item: any, data?: {}): any;
    /**
     * Parse a $$ variable
     *
     * @param {string} str    string to parse
     * @param {object} data   data object to search for variable
     * @returns
     */
    parseSub(str: any, data?: {}): any;
    status(msgType: any, defaultMsg?: any): string;
}

declare class ContextScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    context: string;
    run({ target, context }: {
        target: string;
        context: string | string[];
    }): Promise<void>;
    checkContext(context: any, target: any): Promise<void>;
    inPanda(): Promise<void>;
    inProject(cwd: any): Promise<void>;
    notInProject(cwd: any): Promise<void>;
    inPandaProject(cwd: any, not?: boolean): Promise<void>;
    getPackageJson(cwd: any, onError?: string): Promise<any>;
}

declare class CustomScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    run({ handler, data }: {
        handler: (data: any, ctx: any) => any;
        data?: {
            [key: string]: any;
        };
    }, ctx: any): Promise<any>;
}

declare class FileCopyScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    run({ source, target, options }: {
        source: string;
        target: string;
        options: {
            overwrite?: boolean;
            filter?: (source: string, target: string) => boolean;
        };
    }): Promise<void>;
}

declare class FileModifyScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    run({ target, pattern, replace, transform }: {
        target: string;
        pattern?: string | RegExp;
        replace?: string;
        transform?: (contents: string, data: any) => Promise<string> | string;
    }): Promise<void>;
}

declare class JsonCreateScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    run({ target, data, options, }: {
        target: string;
        data: {
            [key: string]: any;
        };
        options: {
            force?: boolean;
            spaces?: number;
        };
    }): Promise<void>;
}

declare class NpmInstallScaffoldAction extends ScaffoldAction {
    static name: string;
    static description: string;
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    run({ packages, params, target, packageManager, saveDev }: {
        packages: string | string[];
        params?: string[];
        target?: string;
        packageManager?: 'npm' | 'yarn';
        saveDev?: boolean;
    }): Promise<void>;
}

declare class Scaffold extends Command {
    static __type: string;
    scaffoldDir: string;
    cwd: string;
    actions: any[];
    tasks: any[];
    actionTypes: {};
    _actionTypes: {};
    _defaultActionTypes: (typeof ContextScaffoldAction | typeof CustomScaffoldAction | typeof FileCopyScaffoldAction | typeof FileModifyScaffoldAction | typeof JsonCreateScaffoldAction | typeof NpmInstallScaffoldAction)[];
    title: any;
    silent: boolean;
    concurrent: boolean;
    exitOnError: boolean;
    taskTimer: boolean;
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
    registerDefaultActionTypes(): void;
    registerActionTypes(actionTypes?: {}): void;
    registerActionType(action: any, name?: any): void;
    /**
     * Method to trigger once processed
     *
     * @param {object} data       raw data object
     * @param {object} details    complete object of parsed data
     */
    action(data: any, details: any): Promise<void>;
    runTasks(data: any): Promise<void>;
    prepareAction(action: any, data: any): {
        title: any;
        enabled: (ctx: any) => Promise<boolean>;
        task: (_: any, task: any) => any;
    };
    runActions(data: any): Promise<void>;
    runAction(action: any, data: any): Promise<void>;
}

export { Factory, type FactoryCloneConfig, Scaffold, type ScaffoldActionProps, type ScaffoldProps, type ScaffoldTaskProps };
