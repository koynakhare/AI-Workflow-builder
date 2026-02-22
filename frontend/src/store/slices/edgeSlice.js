import { addEdge, applyEdgeChanges } from 'reactflow';

export const createEdgeSlice = (set, get) => ({
  edges: [],
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get()?.edges ?? []),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, type: 'colored', animated: true },
        get()?.edges ?? []
      ),
    });
  },
});
