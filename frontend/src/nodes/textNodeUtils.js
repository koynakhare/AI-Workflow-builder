import { filter, map, get } from 'lodash';

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;
const VARIABLE_FULL_REGEX = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 80;

const NODE_OUTPUTS = {
  customInput: [{ id: 'value', label: 'text' }],
  llm: [{ id: 'response', label: 'response' }],
  text: [{ id: 'output', label: 'text' }],
  customOutput: [],
};

const TYPE_MAP = {
  customInput: 'input',
  llm: 'openai',
  text: 'text',
  customOutput: 'output',
};

const getNodeDisplayName = (nodeId, nodeType) => {
  const match = nodeId?.match(/(\w+)-(\d+)/);
  if (!match) return nodeId ?? '';
  const [, type, num] = match;
  const baseName = get(TYPE_MAP, type, type);
  return `${baseName}_${parseInt(num, 10) - 1}`;
};

export {
  VARIABLE_REGEX,
  VARIABLE_FULL_REGEX,
  MIN_WIDTH,
  MIN_HEIGHT,
  NODE_OUTPUTS,
  getNodeDisplayName,
};
