import * as React from 'react';
import { AppWrapper } from './elements';
import { Tree } from './types';
import { TreeRenderer } from './TreeRenderer';

const tree: Tree = [
  {
    id: '1',
    name: 'Action 1',
    major: [
      {
        id: '1->1',
        name: '1->1',
        major: null,
        minor: null,
      },
      {
        id: '1->2',
        name: '1->2',
        major: null,
        minor: null,
      },
    ],
    minor: [
      {
        id: '1.1',
        name: '1.1',
        major: null,
        minor: null,
      },
      {
        id: '1.2',
        name: '1.2',
        major: [
          {
            id: '1.2->1',
            name: '1.2->1',
            major: null,
            minor: null,
          },
          {
            id: '1.2->2',
            name: '1.2->2',
            major: null,
            minor: null,
          },
        ],
        minor: null,
      },
    ],
  },
  {
    id: '2',
    name: 'Action 2',
    major: null,
    minor: null,
  },
  {
    id: '3',
    name: 'Action 3',
    major: null,
    minor: null,
  },
];

export const TreeApp: React.FunctionComponent = () => {
  return (
    <AppWrapper>
      <TreeRenderer tree={tree} />
    </AppWrapper>
  );
};
