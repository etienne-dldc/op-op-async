import {
  handleArray,
  handleNull,
  handlePromise,
  handleObject,
  handleString,
  executableArray,
} from './handlers/primitive';
import { pipe } from './handlers/utils';
import { handleAttempt, attempt, handleAction, handleRunAction, action } from './handlers/custom';
import { run, Context } from './overmind';

const handleAll = pipe(
  handleNull,
  handleString,
  handleArray,
  handlePromise,
  handleAttempt,
  handleRunAction,
  handleAction,
  handleObject
);

const initialContext: Context = {
  path: [],
  errorHandlers: [],
};

const doStuff = action<number>('doStuff', num => {
  console.log('Hehe', num);
  return null;
});

// run(
//   handleAll,
//   {
//     normal: ['hello'],
//     attempt: ,
//     yolo: [executableArray([null])],
//   },
//   initialContext
// );

run(handleAll, Promise.resolve(doStuff(42)), initialContext);

const isDevtools = window.location.search === '?devtools=true';

if (isDevtools) {
  document.body.innerHTML = `Devtool`;
} else {
  const availableWidth = window.outerWidth;
  const availableHeight = window.outerHeight;
  console.log({
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
  });
  console.log(window.screen);
  const devtoolWidth = window.screen.availWidth * 0.4;
  const selfWidth = window.screen.availWidth * 0.6;

  const opts = `height=${
    window.outerHeight
  },width=${devtoolWidth},left=${selfWidth},top=0,menubar=no,toolbar=no,location=no`;
  window.resizeTo(selfWidth, window.outerHeight);
  window.resizeBy(-200, -200);
  const child = window.open(window.location.pathname + '?devtools=true', '', opts);
  const onClose = () => {
    if (child) {
      child.close();
    }
  };
  window.addEventListener('unload', onClose);
  const onChildClose = () => {
    console.log('child closed');
  };
  if (child) {
    child.addEventListener('unload', onChildClose);
  }
  if (module.hot) {
    module.hot.dispose(data => {
      console.log('reload stuff');
      window.removeEventListener('unload', onClose);
      if (child) {
        child.close();
      }
    });
    module.hot.accept();
  }
}
