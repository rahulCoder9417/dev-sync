
import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { consumeUpdate } from "@/lib/redux/features/collabCodeEditorUpdate";
import { consumeSaveFileOp } from "@/lib/redux/features/collabCodeFileOp";
import { Tab, FileNode } from '@/lib/types/types';
import { saveNode } from './useEditorSave';
import * as Y from 'yjs';
import { showToast } from "@/components/main/Toast";

export const useCollabSync = (
  projectId: string,
  activeTab: Tab | undefined,
  activeTabRef: React.MutableRefObject<Tab | null>,
  docRef: React.MutableRefObject<Y.Doc>,
  docsRef: React.MutableRefObject<Map<string, Y.Doc>>,
  readOnly: boolean,
  setforceRenderEditor: React.Dispatch<React.SetStateAction<boolean>>,
  editorRef: React.MutableRefObject<any>,
  monacoRef: React.MutableRefObject<any>,
  awarenessMap: React.MutableRefObject<Map<string, any>>,
  pendingScrollRef: React.MutableRefObject<{top: number, left: number} | null>,
  updateRemoteDecorations: any,
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean,
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
  setFiles: React.Dispatch<React.SetStateAction<FileNode[]>>
) => {
  const dispatch = useAppDispatch();

  const updatesMap = useAppSelector(
    (state) => activeTab ? (state.collabCodeEditorUpdate.updates?.[activeTab.id] ?? []) : [],
    shallowEqual
  );

  const savePending = useAppSelector(
    (state) => state.collabCodeFileOp.fileSaveProjects?.[projectId] ?? [],
    shallowEqual
  );

  useEffect(() => {
    if (savePending.length === 0) return
    savePending.forEach((item: any) => {
      setTabs(prev => prev.map(t =>
        t.id === item.fileId ? { ...t, content: item.content, isDirty: false } : t
      ));

      setFiles(prev => saveNode(prev, item.fileId, item.content!))

      if (item.fileId !== activeTab?.id) {
        const ydoc = docsRef.current.get(item.fileId);
        if (ydoc) {
          const ytext = ydoc.getText("monaco");
          ytext.delete(0, ytext.length);
          ytext.insert(0, item.content);
        }
      }
      dispatch(consumeSaveFileOp({ projectId }))
    })
  }, [savePending, activeTab?.id, docsRef, setTabs, setFiles, dispatch, projectId]);

  useEffect(() => {
    if (!updatesMap || updatesMap.length === 0) return;

    updatesMap.forEach((update) => {
      const tab = activeTabRef.current;
      if (!tab) return;

      if (update.type === "awareness") {
        if (!readOnly) {
          dispatch(consumeUpdate({ fileId: tab.id }));
          return;
        }
        const editor = editorRef.current
        const monaco = monacoRef.current
        const awareness = awarenessMap.current.get(tab.id);
        
        if (update.data.type === "cursor") {
          awareness.setLocalStateField("remoteCursor", {
            ...update.data.cursor,
            userId: update.data.userId
          });
          const existingSelection = awareness?.getLocalState()?.remoteSelection;

          updateRemoteDecorations(
            editor,
            monaco,
            tab.id,
            update.data.userId,
            update.data.cursor,
            existingSelection?.userId === update.data.userId ? existingSelection : undefined
          );
        }

        if (update.data.type === "selection") {
          awareness.setLocalStateField("remoteSelection", {
            ...update.data.selection,
            userId: update.data.userId
          });

          const existingCursor = awareness?.getLocalState()?.remoteCursor;

          updateRemoteDecorations(
            editor,
            monaco,
            tab.id,
            update.data.userId,
            existingCursor?.userId === update.data.userId ? existingCursor : undefined,
            update.data.selection
          );
        }

        if (update.data.type === "scroll") {
          const editor = editorRef.current;
          
          if (editor?.setScrollTop && editor?.setScrollLeft) {
            editor.setScrollTop(update.data.scroll.top);
            editor.setScrollLeft(update.data.scroll.left);
          } else {
            pendingScrollRef.current = {
              top: update.data.scroll.top,
              left: update.data.scroll.left
            };
          }
        }

        dispatch(consumeUpdate({ fileId: tab.id }));
        return;
      }

      if (update.type === "sync") {
        const diffData = Y.encodeStateAsUpdate(docRef.current);
        sendMessage("syncedData", projectId, tab.id, {
          data: Array.from(diffData),
          updateType: "FirstSync",
          include: update.data,
        });
        
        if(!editorRef.current) return;
        const top = editorRef.current!.getScrollTop();
        const left = editorRef.current!.getScrollLeft();
        sendMessage("awareness", projectId, tab.id, {
          type: "scroll",
          scroll: { top, left }
        });
        dispatch(consumeUpdate({ fileId: tab.id }));
        return;
      }
      
      const updateArray = new Uint8Array(update.data);
      if(update.type==="YjsCodeChangesFirstSync"){
        setforceRenderEditor(prev=>!prev)
        setTimeout(()=>{
          try {
            Y.applyUpdate(docRef.current, updateArray);
          } catch (error) {
            console.error("❌ Failed to apply update:", error);
          }
        },0)
        return
      }
      try {
        Y.applyUpdate(docRef.current, updateArray);
      } catch (error) {
        console.error("❌ Failed to apply update:", error);
      }

      dispatch(consumeUpdate({ fileId: tab.id }));
    });
  }, [updatesMap, dispatch, projectId, sendMessage, readOnly, activeTabRef, docRef, editorRef, monacoRef, awarenessMap, pendingScrollRef, updateRemoteDecorations]);

  return { updatesMap, savePending };
};