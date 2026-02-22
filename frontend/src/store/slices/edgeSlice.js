import { addEdge, applyEdgeChanges } from 'reactflow';
import { filter } from 'lodash';

export const createEdgeSlice = (set, get) => ({
  edges: [],
  deleteEdge: (edgeId) => {
    set({
      edges: filter(get()?.edges ?? [], (e) => e?.id !== edgeId),
    });
  },
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
