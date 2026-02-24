import { addEdge, applyEdgeChanges } from 'reactflow';
import { filter, map } from 'lodash';

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
  onEdgeUpdate: (oldEdge, newConnection) => {
    set({
      edges: map(get()?.edges ?? [], (e) =>
        e?.id === oldEdge?.id
          ? {
              ...e,
              source: newConnection?.source ?? e?.source,
              target: newConnection?.target ?? e?.target,
              sourceHandle: newConnection?.sourceHandle ?? e?.sourceHandle,
              targetHandle: newConnection?.targetHandle ?? e?.targetHandle,
            }
          : e
      ),
    });
  },
});
