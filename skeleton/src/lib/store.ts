{%- if values.stateManagement == "redux" %}
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

// Example slice - replace with your own
const initialState = {
  // Add your state here
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
{%- elif values.stateManagement == "zustand" %}
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Example store - replace with your own
interface AppState {
  // Add your state here
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: '${{values.name}}-storage',
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: '${{values.name}}' }
  )
);
{%- elif values.stateManagement == "jotai" %}
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Example atoms - replace with your own
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'light');

// Derived atom example
export const isDarkModeAtom = atom((get) => get(themeAtom) === 'dark');
{%- else %}
// No state management library enabled
export {};
{%- endif %}
