import { Tree, TreePath, PathStepType, TreeNode } from './types';
import * as React from 'react';
import { TreeWrapper } from './elements';
import { TreeColumn } from './TreeColumn';

type Props = {
  tree: Tree;
};

function notUndefined<T>(val: T | undefined): T {
  if (val === undefined) {
    throw new Error('Unexpected undefined');
  }
  return val;
}

function notNull<T>(val: T | null): T {
  if (val === null) {
    throw new Error('Unexpected null');
  }
  return val;
}

export const TreeRenderer: React.FunctionComponent<Props> = ({ tree }) => {
  const [selectedPath, setSelectedPath] = React.useState<TreePath>([]);

  const columnsPaths: Array<TreePath> = [
    [],
    ...selectedPath.reduce(
      (acc, step, index, arr) => {
        if (acc.length === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(step);
        if (step.type === PathStepType.Major) {
          acc.push([...acc[acc.length - 1]]);
        }
        return acc;
      },
      [] as any
    ),
  ].filter(v => v !== null);

  if (columnsPaths.length >= 2) {
    const last = columnsPaths[columnsPaths.length - 1];
    const beforeLast = columnsPaths[columnsPaths.length - 2];
    if (last.length === beforeLast.length) {
      columnsPaths.pop();
    }
  }

  console.log('======');
  console.log(selectedPath);
  console.log(columnsPaths);

  const columns: Array<{ steps: Tree; path: TreePath }> = columnsPaths.map(path => ({
    path,
    steps: path.reduce((acc: Tree, step) => {
      if (step.type === PathStepType.Major) {
        return notUndefined(acc.find(node => node.id === step.id)).major || [];
      }
      if (step.type === PathStepType.Minor) {
        return notUndefined(acc.find(node => node.id === step.id)).minor || [];
      }
      throw new Error('Whaat');
    }, tree),
  }));

  console.log({ selectedPath, columns, columnsPaths });

  return (
    <TreeWrapper>
      {columns.map((column, index) => (
        <TreeColumn key={index} steps={column.steps} columnPath={column.path} setSelectedPath={setSelectedPath} />
      ))}
    </TreeWrapper>
  );
};
