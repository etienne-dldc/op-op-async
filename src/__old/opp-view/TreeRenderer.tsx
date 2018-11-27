import { Tree, TreePath, PathStepType, TreeContent } from './types';
import * as React from 'react';
import { ColumnsWrapper } from './elements';
import { TreeColumn } from './TreeColumn';
import { selectTree } from './utils';

type Props = {
  tree: Tree;
};

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
        const isLast = index === arr.length - 1;
        if (!isLast && step.type === PathStepType.Major) {
          acc.push([...acc[acc.length - 1]]);
        }
        return acc;
      },
      [] as any
    ),
  ].filter(v => v !== null);

  console.log('======');
  // console.log(selectedPath);

  const columns: Array<{ tree: Tree; path: TreePath }> = columnsPaths
    .map(path => ({
      path,
      tree: selectTree(tree, path),
    }))
    .filter(
      (column): column is { tree: Tree; path: TreePath } => column.tree !== null && column.tree.content.length > 0
    );

  return (
    <ColumnsWrapper>
      {columns.map((column, index) => (
        <TreeColumn
          key={index}
          tree={column.tree}
          columnPath={column.path}
          setSelectedPath={setSelectedPath}
          selectedPath={selectedPath}
          columnIndex={index}
        />
      ))}
    </ColumnsWrapper>
  );
};
