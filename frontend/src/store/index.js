import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createNodeSlice } from './slices/nodeSlice';
import { createEdgeSlice } from './slices/edgeSlice';

export const useStore = create(
  devtools((...args) => ({
    ...createNodeSlice(...args),
    ...createEdgeSlice(...args),
  }))
);

