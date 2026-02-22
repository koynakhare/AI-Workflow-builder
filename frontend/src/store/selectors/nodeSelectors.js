export const selectNodes = (state) => state.nodes;

export const selectNodeById = (id) => (state) =>
  state.nodes.find((node) => node.id === id);

