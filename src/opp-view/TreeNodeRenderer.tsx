import * as React from 'react';
import { TreeNode, TreePath, CreatePathStep, TreeType, Tree, GraphItemType } from './types';
import { MinorTreeWrapper, MinorWrapper, NodeWrapper, NodeContent } from './elements';
import { pathMatch, pathToString, range, treeGraphDepth, getGraphItems, GraphPart } from './utils';

type Props = {
  tree: Tree;
  node: TreeNode;
  parentPath: TreePath;
  setSelectedPath: (path: TreePath) => void;
  selectedPath: TreePath;
  type: TreeType;
  index: number;
  parentSize: number;
  depth: number;
  parentSelected: boolean;
};

const NODE_HEIGHT = 40;

export const TreeNodeRenderer: React.FunctionComponent<Props> = ({
  tree,
  node,
  parentPath,
  setSelectedPath,
  selectedPath,
  depth,
  type,
  parentSize,
  index,
  parentSelected,
}) => {
  const majorPath = [...parentPath, CreatePathStep.Major(node.id)];
  const minorPath = [...parentPath, CreatePathStep.Minor(node.id)];
  const currentPath = [...parentPath, CreatePathStep.Any(node.id)];
  const isInSelectedPath = pathMatch(currentPath, selectedPath);
  const isSelected = pathMatch(currentPath, selectedPath, true);

  const minorTree = node.minor;

  const graph = getGraphItems(tree, parentPath);

  return (
    <MinorTreeWrapper>
      <NodeWrapper
        selected={isInSelectedPath}
        selectedExact={isSelected}
        parentSelected={parentSelected}
        onClick={() => {
          setSelectedPath(majorPath);
        }}
        style={{ height: NODE_HEIGHT }}
      >
        <div style={{ width: depth * 15, marginLeft: 10, background: 'grey' }}>
          <pre style={{ margin: 0 }}>
            {graph.map(v => (v === GraphPart.Dot ? 'o' : v === GraphPart.Line ? '|' : ' ')).join('')}
          </pre>
        </div>
        <NodeContent>{`${node.name} (${pathToString(majorPath)})`}</NodeContent>
      </NodeWrapper>
      {minorTree && (
        <MinorWrapper>
          {minorTree.content.map((minorStep, minorIndex) => {
            return (
              <TreeNodeRenderer
                key={minorStep.id}
                tree={tree}
                node={minorStep}
                parentPath={minorPath}
                setSelectedPath={setSelectedPath}
                selectedPath={selectedPath}
                type={minorTree.type}
                index={minorIndex}
                parentSize={minorTree.content.length}
                depth={depth + treeGraphDepth(minorTree)}
                parentSelected={parentSelected || isSelected}
              />
            );
          })}
        </MinorWrapper>
      )}
    </MinorTreeWrapper>
  );
};
