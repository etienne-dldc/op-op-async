import { AppManager } from './devtools';
import { App } from './devtools/types';

const mainApp: App = () => {
  console.log('mount');

  return () => {
    console.log('unmount');
  };
};

new AppManager({
  devtool: () => {},
  main: mainApp,
});

// import 'normalize.css';
// import { injectGlobal } from 'emotion';
// import { render } from 'react-dom';
// import React from 'react';
// import { TreeApp } from './opp-view';

// import './opp';

// injectGlobal`
// html, body {
//   font-family: 'Fira Code';
// }
// `;

// render(<TreeApp />, document.getElementById('root'));
