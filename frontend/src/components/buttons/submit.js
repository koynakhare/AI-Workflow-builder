
function isDag(nodes, edges) {
  const adjacency = {};
  for (const node of nodes ?? []) {
    adjacency[node?.id] = [];
  }
  for (const edge of edges ?? []) {
    const source = edge?.source;
    if (source in adjacency) {
      adjacency[source].push(edge?.target);
    }
  }

  const visited = new Set();
  const recStack = new Set();

  function hasCycle(node) {
    visited.add(node);
    recStack.add(node);
    for (const neighbor of adjacency[node] ?? []) {
      if (!visited.has(neighbor) && hasCycle(neighbor)) return true;
      if (recStack.has(neighbor)) return true;
    }
    recStack.delete(node);
    return false;
  }

  for (const node of Object.keys(adjacency)) {
    if (!visited.has(node) && hasCycle(node)) return false;
  }
  return true;
}

export function parsePipeline(nodes, edges) {
  return {
    num_nodes: nodes?.length ?? 0,
    num_edges: edges?.length ?? 0,
    is_dag: isDag(nodes, edges),
  };
}

export const submitPipeline = async (nodes, edges) => {
  return parsePipeline(nodes, edges);
};

const SubmitButton = ({ onClick }) => (
  <button type="button" className="button--submit" onClick={onClick}>
    Submit
  </button>
);

export { SubmitButton };
