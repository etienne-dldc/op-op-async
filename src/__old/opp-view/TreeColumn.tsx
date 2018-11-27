import { Tree, TreePath, TreeType, CreatePathStep } from './types';
import * as React from 'react';
import { ColumnWrapper } from './elements';
import { TreeNodeRenderer } from './TreeNodeRenderer';

type Props = {
  tree: Tree;
  columnPath: TreePath;
  setSelectedPath: (path: TreePath) => void;
  selectedPath: TreePath;
  columnIndex: number;
};

export const TreeColumn: React.FunctionComponent<Props> = ({
  tree,
  setSelectedPath,
  columnPath,
  selectedPath,
  columnIndex,
}) => {
  return (
    <ColumnWrapper>
      {tree.content.map((node, index) => {
        return (
          <TreeNodeRenderer
            key={node.id}
            tree={tree}
            node={node}
            parentPath={columnPath}
            setSelectedPath={setSelectedPath}
            selectedPath={selectedPath}
            type={tree.type}
            index={index}
            parentSize={tree.content.length}
            depth={1}
            parentSelected={columnIndex > 0}
          />
        );
      })}
    </ColumnWrapper>
  );
};
