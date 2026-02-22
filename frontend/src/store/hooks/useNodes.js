import { useStore } from '..';
import { selectNodes } from '../selectors/nodeSelectors';

export const useNodes = () => useStore(selectNodes);

export const useNodeActions = () =>
  useStore((state) => ({
    addNode: state.addNode,
    updateNodeField: state.updateNodeField,
    getNodeID: state.getNodeID,
  }));

