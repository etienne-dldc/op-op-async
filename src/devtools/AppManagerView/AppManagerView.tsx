import React from 'react';
import { AppManager } from '..';

type Props = {
  appManager: AppManager;
};

export const AppManagerView: React.FunctionComponent<Props> = ({ appManager }) => {
  return (
    <div>
      {appManager.getAppsNames().map(appName => (
        <button
          key={appName}
          onClick={() => {
            appManager.openApp(appName);
          }}
        >
          Open {appName}
        </button>
      ))}
    </div>
  );
};
