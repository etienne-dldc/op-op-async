import { TreePath, PathStepType, Tree, TreeType, GraphItems, Path, TreeNode } from './types';

export function pathMatch(test: TreePath, ref: TreePath, exact: boolean = false): boolean {
  if (test.length > ref.length) {
    return false;
  }
  if (exact && test.length !== ref.length) {
    return false;
  }
  return test.every((step, index) => {
    const refStep = ref[index];
    return step.id === refStep.id && (step.type === PathStepType.Any ? true : step.type === refStep.type);
  });
}

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

export function selectTree(tree: Tree, path: TreePath): Tree | null {
  return path.reduce((acc: Tree | null, step) => {
    if (acc === null) {
      return null;
    }
    const item = notUndefined(acc.content.find(node => node.id === step.id));
    if (step.type === PathStepType.Major) {
      return item.major;
    }
    if (step.type === PathStepType.Minor) {
      const minor = item.minor;
      return item.minor;
    }
    throw new Error('Whaat');
  }, tree);
}

export function select(tree: Tree, path: Path): Path extends TreePath ? (Tree | null) : (TreeNode | null) {
  const treePath = Array.isArray(path) ? path : path.treePath;
  const targetTree = selectTree(tree, treePath);
  if (Array.isArray(path)) {
    return targetTree as any;
  }
  if (targetTree === null) {
    return null;
  }
  return notUndefined(targetTree.content.find(node => node.id === path.id));
}

export function range(size: number) {
  return Array(size)
    .fill(null)
    .map((v, i) => i);
}

export function pathToString(path: TreePath): string {
  return path
    .map((step, index, arr) => {
      const isLast = index === arr.length - 1;
      const sep = step.type === PathStepType.Major ? '_' : '.';
      return `${step.id}${isLast ? '' : sep}`;
    })
    .join('');
}

export function treeGraphDepth(tree: Tree): number {
  return tree.type === TreeType.Branch ? tree.content.length : 1;
}

export function maxTreeGraphDepth(tree: Tree): number {
  return treeGraphDepth(tree) + Math.max(...tree.content.map(node => (node.minor ? maxTreeGraphDepth(node.minor) : 0)));
}

export enum GraphPart {
  Dot = 'Dot',
  Line = 'Line',
  Space = 'Space',
}

export function getGraphParts(tree: Tree, path: TreePath): Array<GraphPart> {
  const parts: Array<GraphPart> = [GraphPart.Dot];

  console.log('=====');
  console.log(path);

  const currentTree = notNull(selectTree(tree, path));

  const parentPaths =
    path.length > 0
      ? range(path.length)
          .map(i => path.slice(0, i))
          .reverse()
      : [];

  let parents = [currentTree, ...parentPaths.map(parentPath => notNull(selectTree(tree, parentPath)))];

  console.log(parents);

  parents.forEach(parent => {});

  const contentMaxDepth = maxTreeGraphDepth(currentTree) - treeGraphDepth(currentTree) - 1;

  if (contentMaxDepth > 0) {
    parts.push(...range(contentMaxDepth).map(v => GraphPart.Space));
  }

  // parts.unshift()

  // console.log(path, parts);

  return parts;
}

export function getGraphItems(tree: Tree, path: TreePath): Array<GraphPart> {
  return getGraphParts(tree, path);
}
