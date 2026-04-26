import { useEffect, useRef, useState } from 'react';

export function useDraftResource<T>(
  key: string | undefined,
  load: () => Promise<T>,
  save: (value: T) => Promise<unknown>
) {
  const loadRef = useRef(load);
  const saveRef = useRef(save);
  loadRef.current = load;
  saveRef.current = save;

  const [saved, setSaved] = useState<T | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    loadRef
      .current()
      .then((v) => {
        if (cancelled) return;
        setSaved(v);
        setDraft(v);
      })
      .catch((e: Error) => {
        if (!cancelled) setLoadError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const isDirty =
    saved !== null &&
    draft !== null &&
    JSON.stringify(saved) !== JSON.stringify(draft);

  async function commit() {
    if (draft === null) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveRef.current(draft);
      setSaved(draft);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (saved !== null) setDraft(saved);
    setSaveError(null);
  }

  return {
    draft,
    setDraft,
    loading,
    loadError,
    saving,
    saveError,
    isDirty,
    commit,
    discard,
  };
}
