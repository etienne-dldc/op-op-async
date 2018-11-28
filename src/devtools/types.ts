import { AppManager } from '.';

export type AppNames = 'main' | 'devtool';

type UnmountApp = () => void | Promise<void>;
export type App = (manager: AppManager) => void | UnmountApp | Promise<UnmountApp | void>;
