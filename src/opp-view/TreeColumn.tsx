import { Tree, TreePath } from './types';
import * as React from 'react';
import { ColumnWrapper } from './elements';
import { TreeStep } from './TreeStep';

type Props = {
  steps: Tree;
  columnPath: TreePath;
  setSelectedPath: (path: TreePath) => void;
};

export const TreeColumn: React.FunctionComponent<Props> = ({ steps, setSelectedPath, columnPath }) => {
  return (
    <ColumnWrapper>
      {steps.map(step => (
        <TreeStep key={step.id} step={step} parentPath={columnPath} setSelectedPath={setSelectedPath} />
      ))}
    </ColumnWrapper>
  );
};
