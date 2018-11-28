import * as queryString from 'query-string';
import { appManagerView } from './AppManagerView';
import { App, AppNames } from './types';

export class AppManager {
  private appWindows: { [K in AppNames]?: Window | null } = {};
  private appName: AppNames | null = null;

  constructor(private apps: { [K in AppNames]: App }) {
    if (process.env.NODE_ENV === 'production') {
      apps.main(this);
      return;
    }
    const params = queryString.parse(window.location.search);
    (window as any).appManager = this;
    if (!params.app) {
      appManagerView(this);
      window.addEventListener('unload', this.onRootClose);
      return;
    }
    this.appName = params.app as any;
    window.addEventListener('unload', () => {
      if (!window.opener.closed) {
        console.log(window.opener.appManager.childClosed(this.appName));
      }
    });
  }

  onRootClose = () => {
    this.getAppsNames()
      .map(name => this.appWindows[name])
      .forEach(win => {
        if (win) {
          win.close();
        }
      });
  };

  openApp(appName: AppNames): void {
    const current = this.appWindows[appName];
    if (current) {
      current.focus();
      return;
    }
    const opts = `height=500,width=500,left=500,top=0,menubar=no,toolbar=no,location=no`;
    const newWindow = window.open(window.location.pathname + `?app=${appName}`, '', opts);
    if (newWindow) {
      this.appWindows[appName] = newWindow;
      (newWindow as any).appManager = this;
      // newWindow.addEventListener('unload', () => {
      //     if (!newWindow.opener.closed) window.opener.onCloseWindow(window)
      //   this.childClosed(appName);
      // });
    }
    return;
  }

  childClosed(appName: AppNames) {
    console.log('childClose', appName);

    this.appWindows[appName] = null;
  }

  getAppsNames = (): Array<AppNames> => {
    return Object.keys(this.apps) as any;
  };
}
