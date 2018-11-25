export enum TreeType {
  Linear = 'Linear',
  Branch = 'Branch',
}

export type TreeContent = Array<TreeNode>;

export type Tree = {
  type: TreeType;
  content: TreeContent;
};

export type TreeNode = {
  id: string;
  name: string;
  minor: Tree | null;
  major: Tree | null;
};

export enum PathStepType {
  Minor = 'Minor',
  Major = 'Major',
  Any = 'Any',
}

export type TreePathStep = { type: PathStepType; id: string };
export type TreePath = Array<TreePathStep>;
export type TreeNodePath = {
  treePath: TreePath;
  id: string;
};

export type Path = TreePath | TreeNodePath;

export const CreatePathStep = {
  Minor: (id: string): TreePathStep => ({ id, type: PathStepType.Minor }),
  Major: (id: string): TreePathStep => ({ id, type: PathStepType.Major }),
  Any: (id: string): TreePathStep => ({ id, type: PathStepType.Any }),
};

export enum GraphItemType {
  Line = 'Line',
  Dot = 'Dot',
}

export type GraphItem = {
  type: GraphItemType;
  position: number;
};

export type GraphItems = Array<GraphItem>;
