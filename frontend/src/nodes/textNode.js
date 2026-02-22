import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Position, useReactFlow } from 'reactflow';
import { filter, map } from 'lodash';
import { NodeWrapper } from '../components/NodeWrapper';
import { AutocompleteDropdown } from '../components/AutocompleteDropdown';
import { useNodeActions } from '../store/hooks/useNodes';
import {
  VARIABLE_REGEX,
  VARIABLE_FULL_REGEX,
  MIN_WIDTH,
  MIN_HEIGHT,
  NODE_OUTPUTS,
  getNodeDisplayName,
  getNodeInternalName,
  isValidVariableIdentifier,
} from './textNodeUtils';

export const TextNode = ({ id, data }) => {
  const { getNodes, setNodes } = useReactFlow();
  const { updateNodeField } = useNodeActions();
  const [currText, setCurrText] = useState(data?.text ?? '');
  const [nodeWidth, setNodeWidth] = useState(data?.width ?? MIN_WIDTH);
  const [nodeHeight, setNodeHeight] = useState(data?.height ?? MIN_HEIGHT);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteStep, setAutocompleteStep] = useState(1);
  const [autocompletePosition, setAutocompletePosition] = useState({ x: 0, y: 0 });
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  const updateDimensions = useCallback(
    (width, height) => {
      setNodes((nodes) =>
        map(nodes, (node) =>
          node?.id === id ? { ...node, width, height } : node
        )
      );
    },
    [id, setNodes]
  );

  const getAllNodes = useCallback(
    () => filter(getNodes(), (node) => node?.id !== id),
    [id, getNodes]
  );

  const getNodeOutputHandles = useCallback((node) => {
    const outputs = NODE_OUTPUTS[node?.type] ?? [];
    return map(outputs, (output) => ({
      id: output?.id,
      label: output?.label,
      fullId: `${node?.id}-${output?.id}`,
    }));
  }, []);

  const validateVariable = useCallback(
    (variableText) => {
      const match = variableText?.match(VARIABLE_FULL_REGEX);
      if (!match) return { valid: false, error: 'Invalid format' };
      const parts = match[0]?.match(/\{\{([^.]+)\.([^}]+)\}\}/) ?? [];
      const [, nodeName, outputField] = parts;
      if (!nodeName || !outputField) return { valid: false, error: 'Invalid format' };
      const nodes = getAllNodes();
      const node = nodes?.find(
        (n) =>
          getNodeInternalName(n?.id, n?.type) === nodeName?.trim() ||
          getNodeDisplayName(n) === nodeName?.trim()
      );
      if (!node) return { valid: false, error: `Node "${nodeName}" not found` };
      const outputs = getNodeOutputHandles(node);
      const output = outputs?.find(
        (o) => o?.label === outputField?.trim() || o?.id === outputField?.trim()
      );
      if (!output) return { valid: false, error: `Output field "${outputField}" not found` };
      return { valid: true, node, output };
    },
    [getAllNodes, getNodeOutputHandles]
  );

  const extractVariables = useCallback(
    (text) => {
      const variables = [];
      let match;
      const regex = new RegExp(VARIABLE_REGEX);
      while ((match = regex.exec(text)) !== null) {
        const validation = validateVariable(match[0]);
        variables.push({
          text: match[0],
          fullMatch: match[0],
          start: match.index,
          end: match.index + match[0].length,
          ...validation,
        });
      }
      return variables;
    },
    [validateVariable]
  );

  const generateNodeSuggestions = useCallback(
    (prefix = '') => {
      const nodes = getAllNodes();
      const prefixLower = prefix?.toLowerCase?.()?.trim?.() ?? '';
      return filter(nodes, (node) => {
        const displayName = getNodeDisplayName(node);
        const internalName = getNodeInternalName(node?.id, node?.type);
        return (
          !prefixLower ||
          displayName?.toLowerCase?.()?.includes?.(prefixLower) ||
          internalName?.toLowerCase?.()?.includes?.(prefixLower)
        );
      }).map((node) => {
        const displayName = getNodeDisplayName(node);
        const internalName = getNodeInternalName(node?.id, node?.type);
        const value = isValidVariableIdentifier(displayName) ? displayName : internalName;
        return {
          type: 'node',
          nodeId: node?.id,
          nodeType: node?.type,
          displayName,
          label: displayName,
          value,
        };
      });
    },
    [getAllNodes]
  );

  const generateOutputSuggestions = useCallback(
    (node, prefix = '') => {
      const outputs = getNodeOutputHandles(node);
      const prefixLower = prefix?.toLowerCase?.()?.trim?.() ?? '';
      return filter(outputs, (output) =>
        !prefixLower || output?.label?.toLowerCase?.()?.includes?.(prefixLower)
      ).map((output) => {
        const displayName = getNodeDisplayName(node);
        const internalName = getNodeInternalName(node?.id, node?.type);
        const nodePart = isValidVariableIdentifier(displayName) ? displayName : internalName;
        return {
          type: 'field',
          nodeId: node?.id,
          nodeDisplayName: displayName,
          fieldId: output?.id,
          fieldLabel: output?.label,
          label: output?.label,
          value: `${nodePart}.${output?.label}`,
        };
      });
    },
    [getNodeOutputHandles]
  );

  const handleTextChange = useCallback(
    (e) => {
      const newText = e?.target?.value ?? '';
      setCurrText(newText);
      updateNodeField(id, 'text', newText);
      setCursorPosition(e?.target?.selectionStart ?? 0);
      const cursorPos = e?.target?.selectionStart ?? 0;
      const beforeCursor = newText?.substring?.(0, cursorPos) ?? '';
      const lastOpen = beforeCursor?.lastIndexOf?.('{{') ?? -1;

      if (lastOpen !== -1 && !beforeCursor?.substring?.(lastOpen + 2)?.includes?.('}}')) {
        const afterOpen = beforeCursor?.substring?.(lastOpen + 2) ?? '';
        const hasDot = afterOpen?.includes?.('.') ?? false;

        const textarea = textareaRef?.current;
        if (textarea && nodeRef?.current) {
          const rect = textarea.getBoundingClientRect();
          const nodeRect = nodeRef.current.getBoundingClientRect();
          setAutocompletePosition({
            x: rect.left - nodeRect.left + 10,
            y: rect.top - nodeRect.top + 20,
          });
        }

        if (hasDot) {
          const parts = afterOpen?.split?.('.') ?? [];
          const nodeName = parts[0]?.trim?.() ?? '';
          const fieldPrefix = parts[1]?.trim?.() ?? '';
          const nodes = getAllNodes();
          const node = nodes?.find?.(
            (n) =>
              getNodeInternalName(n?.id, n?.type) === nodeName ||
              getNodeDisplayName(n) === nodeName
          );
          if (node) {
            setSelectedNode(node);
            setAutocompleteStep(2);
            const suggestions = generateOutputSuggestions(node, fieldPrefix);
            setAutocompleteSuggestions(suggestions);
            setAutocompleteOpen(suggestions?.length > 0);
            setSelectedSuggestionIndex(0);
          } else {
            setAutocompleteOpen(false);
          }
        } else {
          setSelectedNode(null);
          setAutocompleteStep(1);
          const nodePrefix = afterOpen?.trim?.() ?? '';
          const suggestions = generateNodeSuggestions(nodePrefix);
          setAutocompleteSuggestions(suggestions);
          setAutocompleteOpen(suggestions?.length > 0);
          setSelectedSuggestionIndex(0);
        }
      } else {
        setAutocompleteOpen(false);
      }
    },
    [
      id,
      updateNodeField,
      getAllNodes,
      generateNodeSuggestions,
      generateOutputSuggestions,
    ]
  );

  const handleAutocompleteSelect = useCallback(
    (suggestion) => {
      const textarea = textareaRef?.current;
      if (!textarea) return;
      const beforeCursor = currText?.substring?.(0, cursorPosition) ?? '';
      const afterCursor = currText?.substring?.(cursorPosition) ?? '';
      const lastOpen = beforeCursor?.lastIndexOf?.('{{') ?? -1;

      if (lastOpen !== -1) {
        const beforeOpen = currText?.substring?.(0, lastOpen) ?? '';
        if (suggestion?.type === 'field') {
          const newText = `${beforeOpen}{{${suggestion?.value}}}${afterCursor}`;
          setCurrText(newText);
          updateNodeField(id, 'text', newText);
          setAutocompleteOpen(false);
          const newCursorPos = beforeOpen?.length + suggestion?.value?.length + 4;
          setTimeout(() => {
            textarea?.setSelectionRange?.(newCursorPos, newCursorPos);
            setCursorPosition(newCursorPos);
          }, 0);
        } else if (suggestion?.type === 'node') {
          const node = getAllNodes()?.find?.((n) => n?.id === suggestion?.nodeId);
          if (node) {
            setSelectedNode(node);
            const newText = `${beforeOpen}{{${suggestion?.value}.${afterCursor}`;
            setCurrText(newText);
            updateNodeField(id, 'text', newText);
            const newCursorPos = beforeOpen?.length + suggestion?.value?.length + 3;
            setTimeout(() => {
              textarea?.setSelectionRange?.(newCursorPos, newCursorPos);
              setCursorPosition(newCursorPos);
            }, 0);
            setAutocompleteStep(2);
            setAutocompleteSuggestions(generateOutputSuggestions(node, ''));
            setSelectedSuggestionIndex(0);
          }
        }
      }
    },
    [
      currText,
      cursorPosition,
      id,
      updateNodeField,
      getAllNodes,
      generateOutputSuggestions,
    ]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!autocompleteOpen) return;
      if (e?.key === 'ArrowDown') {
        e?.preventDefault?.();
        setSelectedSuggestionIndex((prev) =>
          prev < (autocompleteSuggestions?.length ?? 0) - 1 ? prev + 1 : prev
        );
      } else if (e?.key === 'ArrowUp') {
        e?.preventDefault?.();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e?.key === 'Enter' && (autocompleteSuggestions?.length ?? 0) > 0) {
        e?.preventDefault?.();
        handleAutocompleteSelect(autocompleteSuggestions?.[selectedSuggestionIndex]);
      }
    },
    [
      autocompleteOpen,
      autocompleteSuggestions,
      selectedSuggestionIndex,
      handleAutocompleteSelect,
    ]
  );

  const handleResize = useCallback(
    (width, height) => {
      setNodeWidth(width);
      setNodeHeight(height);
      updateNodeField(id, 'width', width);
      updateNodeField(id, 'height', height);
      updateDimensions(width, height);
    },
    [id, updateNodeField, updateDimensions]
  );

  const variables = useMemo(() => extractVariables(currText), [currText, extractVariables]);
  const invalidVariables = filter(variables, (v) => !v?.valid);
  const variableHandles = map(filter(variables, (v) => v?.valid), (v) => ({
    type: 'target',
    position: Position.Left,
    id: `${id}-${v?.node?.id}-${v?.output?.id}`,
  }));
  const handles = [
    ...variableHandles,
    { type: 'source', position: Position.Right, id: `${id}-output` },
  ];

  const fields = [
    {
      type: 'textarea',
      props: {
        label: 'Text',
        value: currText,
        onChange: handleTextChange,
        onKeyDown: handleKeyDown,
        onResize: handleResize,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        textareaRef: textareaRef,
      },
    },
  ];

  return (
    <div ref={nodeRef} className="node-error-wrapper">
      <NodeWrapper
        id={id}
        title="Text"
        nodeType="text"
        handles={handles}
        fields={fields}
        width={nodeWidth}
        height={nodeHeight}
      />
      {invalidVariables?.length > 0 && (
        <div className="node-error">{invalidVariables?.[0]?.error}</div>
      )}
      {autocompleteOpen && (
        <AutocompleteDropdown
          position={autocompletePosition}
          suggestions={autocompleteSuggestions}
          selectedIndex={selectedSuggestionIndex}
          onSelect={handleAutocompleteSelect}
          onClose={() => setAutocompleteOpen(false)}
          onHover={setSelectedSuggestionIndex}
          step={autocompleteStep}
        />
      )}
    </div>
  );
};
