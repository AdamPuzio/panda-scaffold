export { Factory, PandaFactory } from '@panda/factory';
import { CommandProps, Command } from '@panda/command';

interface ScaffoldProps extends CommandProps {
    scaffoldDir?: string;
    actions?: ScaffoldActionProps[];
    actionTypes?: {
        [key: string]: any;
    };
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
    /** Pre-existing bug fix: scaffold.ts's runAction() calls
     *  `actionInstance.when(...)` to decide whether to skip an action, but
     *  this base class never defined it — every action execution was
     *  already broken (`when is not a function`) before this fix, unrelated
     *  to the kernel retrofit. Default: always proceed, matching the
     *  evident intent (conditional skip logic subclasses can override). */
    when(action: any, data: any, factory: any): Promise<boolean>;
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

export { type FactoryCloneConfig, Scaffold, ScaffoldAction, ScaffoldActionAdd, ScaffoldActionAddMany, ScaffoldActionContext, ScaffoldActionCustom, ScaffoldActionModify, type ScaffoldActionProps, type ScaffoldActionTypeProps, type ScaffoldProps };
