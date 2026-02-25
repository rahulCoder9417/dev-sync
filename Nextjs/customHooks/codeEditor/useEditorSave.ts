
import { useCallback } from 'react';
import * as Y from 'yjs';
import { Tab, FileNode } from '@/lib/types/types';
import { showToast } from "@/components/main/Toast";
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import { saveContent } from '@/lib/redux/features/projectFileSlice';


export const useEditorSave = (
  docRef: React.MutableRefObject<Y.Doc>,
  activeTabRef: React.MutableRefObject<Tab | null>,
  readOnly: boolean,
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>,
  sendMessage: (message: string, projectId: string, fileId: string | undefined, data?: any) => boolean,
  projectId: string
) => {
  const dispatch = useAppDispatch();
  
  const handleSave = useCallback(async () => {
    const tab = activeTabRef.current;
    if (!tab || readOnly) return;
    try {
      const ytext = docRef.current.getText("monaco");
      const newContent = ytext.toString();
      setTabs(prev => prev.map(t =>
        t.id === tab.id ? { ...t, content: newContent, isDirty: false } : t
      ));
     dispatch(saveContent({ id: tab.id, content: newContent }));
      const res: any = await fetch(`/api/projects/fileItem/updateContent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: tab.id, content: newContent }),
      }).then(res => res.json())
      if (res.status !== 200) {
        showToast(false, "Error saving content  -> " + res.error, "Please do a refresh");
        return
      }
      sendMessage("fileSave", projectId, tab.id, { content: newContent });
    } catch (e) {
      console.error("Save failed", e);
    }
  }, [docRef, activeTabRef, readOnly, setTabs, sendMessage, projectId]);

  return { handleSave };
};