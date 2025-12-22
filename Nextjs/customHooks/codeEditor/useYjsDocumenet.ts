
import { useCallback, useRef } from 'react';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness.js';

export const useYjsDocument = () => {
  const docsRef = useRef<Map<string, Y.Doc>>(new Map());
  const awarenessMap = useRef<Map<string, any>>(new Map());
  const docRef = useRef<Y.Doc>(new Y.Doc());

  const getOrCreateDoc = useCallback((tabId: string) => {
    const docs = docsRef.current;
    if (!docs.has(tabId)) {
      docs.set(tabId, new Y.Doc());
    }
    return docs.get(tabId)!;
  }, []);

  const getOrCreateAwareness = useCallback((tabId: string) => {
    if (!awarenessMap.current.has(tabId)) {
      const doc = docsRef.current.get(tabId);
      const awareness = new awarenessProtocol.Awareness(doc!);
      awareness.setLocalState({});
      awarenessMap.current.set(tabId, awareness);
    }
    return awarenessMap.current.get(tabId);
  }, []);

  return {
    docsRef,
    awarenessMap,
    docRef,
    getOrCreateDoc,
    getOrCreateAwareness
  };
};
