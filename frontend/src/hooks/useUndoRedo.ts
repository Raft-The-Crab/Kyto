import { useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: T) => void;
}

const MAX_HISTORY = 50; // Limit history to prevent memory issues

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const history = useRef<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    const nextState = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(history.current.present)
      : newState;

    // Don't add to history if state hasn't changed
    if (JSON.stringify(nextState) === JSON.stringify(history.current.present)) {
      return;
    }

    const newPast = [...history.current.past, history.current.present];
    
    // Limit history size
    if (newPast.length > MAX_HISTORY) {
      newPast.shift();
    }

    history.current = {
      past: newPast,
      present: nextState,
      future: [], // Clear future when new state is set
    };

    // Trigger re-render by updating ref
    window.dispatchEvent(new CustomEvent('undo-redo-update'));
  }, []);

  const undo = useCallback(() => {
    if (history.current.past.length === 0) return;

    const previous = history.current.past[history.current.past.length - 1];
    const newPast = history.current.past.slice(0, -1);

    history.current = {
      past: newPast,
      present: previous,
      future: [history.current.present, ...history.current.future],
    };

    window.dispatchEvent(new CustomEvent('undo-redo-update'));
  }, []);

  const redo = useCallback(() => {
    if (history.current.future.length === 0) return;

    const next = history.current.future[0];
    const newFuture = history.current.future.slice(1);

    history.current = {
      past: [...history.current.past, history.current.present],
      present: next,
      future: newFuture,
    };

    window.dispatchEvent(new CustomEvent('undo-redo-update'));
  }, []);

  const reset = useCallback((newState: T) => {
    history.current = {
      past: [],
      present: newState,
      future: [],
    };
    window.dispatchEvent(new CustomEvent('undo-redo-update'));
  }, []);

  return {
    state: history.current.present,
    setState,
    undo,
    redo,
    canUndo: history.current.past.length > 0,
    canRedo: history.current.future.length > 0,
    reset,
  };
}
