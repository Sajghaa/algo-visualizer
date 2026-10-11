import type { TreeNode } from '../types';

export function buildBalancedBST(
  values: number[]
): { nodes: TreeNode[]; rootId: string } {
  const nodes: TreeNode[] = [];
  let nextId = 0;

  function build(sorted: number[], lo: number, hi: number): string | undefined {
    if (lo > hi) return undefined;
    const mid = Math.floor((lo + hi) / 2);
    const id = `n${nextId++}`;
    nodes.push({ id, value: sorted[mid] });
    const leftId = build(sorted, lo, mid - 1);
    const rightId = build(sorted, mid + 1, hi);
    const idx = nodes.findIndex((n) => n.id === id);
    nodes[idx] = { ...nodes[idx], left: leftId, right: rightId };
    return id;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const rootId = build(sorted, 0, sorted.length - 1) ?? '';
  return { nodes, rootId };
}

export function getHeight(nodes: TreeNode[], id: string | undefined): number {
  if (!id) return 0;
  const node = nodes.find((n) => n.id === id);
  if (!node) return 0;
  return 1 + Math.max(getHeight(nodes, node.left), getHeight(nodes, node.right));
}

export function getBalance(nodes: TreeNode[], id: string): number {
  const node = nodes.find((n) => n.id === id);
  if (!node) return 0;
  return getHeight(nodes, node.left) - getHeight(nodes, node.right);
}

export function rotateRight(nodes: TreeNode[], pivotId: string): string {
  const pivot = nodes.find((n) => n.id === pivotId)!;
  const newRoot = nodes.find((n) => n.id === pivot.left)!;
  const newRootId = newRoot.id;

  const pivotIdx = nodes.findIndex((n) => n.id === pivotId);
  nodes[pivotIdx] = { ...pivot, left: newRoot.right };

  const newRootIdx = nodes.findIndex((n) => n.id === newRootId);
  nodes[newRootIdx] = { ...newRoot, right: pivotId };

  return newRootId;
}

export function rotateLeft(nodes: TreeNode[], pivotId: string): string {
  const pivot = nodes.find((n) => n.id === pivotId)!;
  const newRoot = nodes.find((n) => n.id === pivot.right)!;
  const newRootId = newRoot.id;

  const pivotIdx = nodes.findIndex((n) => n.id === pivotId);
  nodes[pivotIdx] = { ...pivot, right: newRoot.left };

  const newRootIdx = nodes.findIndex((n) => n.id === newRootId);
  nodes[newRootIdx] = { ...newRoot, left: pivotId };

  return newRootId;
}

export function rebalanceNode(
  nodes: TreeNode[],
  nodeId: string,
  insertedValue?: number,
  isDelete: boolean = false
): { newRoot: string; rotated: boolean; caseType?: 'LL' | 'RR' | 'LR' | 'RL' } {
  const balance = getBalance(nodes, nodeId);
  const node = nodes.find((n) => n.id === nodeId)!;
  const leftBalance = node.left ? getBalance(nodes, node.left) : 0;
  const rightBalance = node.right ? getBalance(nodes, node.right) : 0;


  let caseType: 'LL' | 'RR' | 'LR' | 'RL' | undefined;

  if (balance > 1) {
   
    if (isDelete) {
      caseType = leftBalance >= 0 ? 'LL' : 'LR';
    } else {
      caseType = (insertedValue !== undefined && node.left &&
                  insertedValue > nodes.find((n) => n.id === node.left)!.value)
        ? 'LR' : 'LL';
    }
  } else if (balance < -1) {
    
    if (isDelete) {
      caseType = rightBalance <= 0 ? 'RR' : 'RL';
    } else {
      caseType = (insertedValue !== undefined && node.right &&
                  insertedValue < nodes.find((n) => n.id === node.right)!.value)
        ? 'RL' : 'RR';
    }
  }

  if (!caseType) return { newRoot: nodeId, rotated: false };

  let newRoot: string;
  if (caseType === 'LL') {
    newRoot = rotateRight(nodes, nodeId);
  } else if (caseType === 'RR') {
    newRoot = rotateLeft(nodes, nodeId);
  } else if (caseType === 'LR') {
    const newLeft = rotateLeft(nodes, node.left!);
    const idx = nodes.findIndex((n) => n.id === nodeId);
    nodes[idx] = { ...nodes[idx], left: newLeft };
    newRoot = rotateRight(nodes, nodeId);
  } else {
    const newRight = rotateRight(nodes, node.right!);
    const idx = nodes.findIndex((n) => n.id === nodeId);
    nodes[idx] = { ...nodes[idx], right: newRight };
    newRoot = rotateLeft(nodes, nodeId);
  }

  return { newRoot, rotated: true, caseType };
}