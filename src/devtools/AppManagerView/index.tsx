import { AppManagerView } from './AppManagerView';
import { render } from 'react-dom';
import React from 'react';
import { App } from '../types';

export const appManagerView: App = appManager => {
  const root = document.getElementById('root');
  render(<AppManagerView appManager={appManager} />, root);
};
