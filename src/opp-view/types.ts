export type TreeNode = {
  id: string;
  name: string;
  minor: Array<TreeNode> | null;
  major: Array<TreeNode> | null;
};

export type Tree = Array<TreeNode>;

export enum PathStepType {
  Minor = 'Minor',
  Major = 'Major',
}

export type TreePathStep = { type: PathStepType; id: string };
export type TreePath = Array<TreePathStep>;

export const CreatePathStep = {
  Minor: (id: string): TreePathStep => ({ id, type: PathStepType.Minor }),
  Major: (id: string): TreePathStep => ({ id, type: PathStepType.Major }),
};
