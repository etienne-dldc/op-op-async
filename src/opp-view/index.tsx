import * as React from 'react';
import { AppWrapper } from './elements';
import { Tree, TreeType } from './types';
import { TreeRenderer } from './TreeRenderer';

const tree: Tree = {
  type: TreeType.Linear,
  content: [
    {
      id: '1',
      name: 'Action 1',
      major: {
        type: TreeType.Linear,
        content: [
          {
            id: '1',
            name: '1->1',
            major: null,
            minor: null,
          },
          {
            id: '2',
            name: '1->2',
            major: null,
            minor: null,
          },
        ],
      },
      minor: {
        type: TreeType.Linear,
        content: [
          {
            id: '1',
            name: '1.1',
            major: null,
            minor: null,
          },
          {
            id: '2',
            name: '1.2',
            major: {
              type: TreeType.Linear,
              content: [
                {
                  id: '1',
                  name: '1.2->1',
                  major: null,
                  minor: null,
                },
                {
                  id: '2',
                  name: '1.2->2',
                  major: null,
                  minor: null,
                },
              ],
            },
            minor: null,
          },
        ],
      },
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
    {
      id: '4',
      name: 'Para A',
      major: null,
      minor: {
        type: TreeType.Branch,
        content: [
          {
            id: '1',
            name: 'Para 1',
            major: null,
            minor: null,
          },
          {
            id: '2',
            name: 'Para 2',
            major: null,
            minor: {
              type: TreeType.Branch,
              content: [
                {
                  id: '1',
                  name: 'Para a',
                  major: null,
                  minor: null,
                },
                {
                  id: '2',
                  name: 'Para b',
                  major: null,
                  minor: null,
                },
              ],
            },
          },
          {
            id: '3',
            name: 'Para 3',
            major: null,
            minor: null,
          },
        ],
      },
    },
    {
      id: '5',
      name: 'Para B',
      major: null,
      minor: {
        type: TreeType.Branch,
        content: [
          {
            id: '1',
            name: 'Para 1',
            major: null,
            minor: null,
          },
        ],
      },
    },
  ],
};

export const TreeApp: React.FunctionComponent = () => {
  return (
    <AppWrapper>
      <TreeRenderer tree={tree} />
    </AppWrapper>
  );
};
