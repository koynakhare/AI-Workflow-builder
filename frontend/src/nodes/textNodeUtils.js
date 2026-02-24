import { get } from 'lodash';

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;
const VARIABLE_FULL_REGEX = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 80;

const NODE_OUTPUTS = {
  customInput: [
    { id: 'value', label: 'text', inputType: 'Text' },
    { id: 'value', label: 'file', inputType: 'File' },
  ],
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

const getNodeInternalName = (nodeId, nodeType) => {
  const match = nodeId?.match(/(\w+)-(\d+)/);
  if (!match) return nodeId ?? '';
  const [, type, num] = match;
  const baseName = get(TYPE_MAP, type, type);
  return `${baseName}_${parseInt(num, 10) - 1}`;
};

const getNodeDisplayName = (node) => {
  if (!node) return '';
  const internal = getNodeInternalName(node?.id, node?.type);
  if (node?.type === 'customInput' && node?.data?.inputName?.trim?.()) {
    return node.data.inputName.trim();
  }
  if (node?.type === 'customOutput' && node?.data?.outputName?.trim?.()) {
    return node.data.outputName.trim();
  }
  return internal;
};

const isValidVariableIdentifier = (name) =>
  typeof name === 'string' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name?.trim());

export {
  VARIABLE_REGEX,
  VARIABLE_FULL_REGEX,
  MIN_WIDTH,
  MIN_HEIGHT,
  NODE_OUTPUTS,
  getNodeDisplayName,
  getNodeInternalName,
  isValidVariableIdentifier,
};
