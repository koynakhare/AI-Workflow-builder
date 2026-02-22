import { useStore } from '..';
import { selectEdges } from '../selectors/edgeSelectors';

export const useEdges = () => useStore(selectEdges);

export const useEdgeActions = () =>
  useStore((state) => ({
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
  }));

