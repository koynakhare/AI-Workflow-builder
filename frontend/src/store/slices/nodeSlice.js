import { applyNodeChanges } from 'reactflow';
import { map } from 'lodash';

export const createNodeSlice = (set, get) => ({
  nodes: [],
  nodeIDs: {},
  getNodeID: (type) => {
    const newIDs = { ...get()?.nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({ nodes: [...(get()?.nodes ?? []), node] });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get()?.nodes ?? []),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: map(get()?.nodes ?? [], (node) =>
        node?.id === nodeId
          ? { ...node, data: { ...node?.data, [fieldName]: fieldValue } }
          : node
      ),
    });
  },
});
