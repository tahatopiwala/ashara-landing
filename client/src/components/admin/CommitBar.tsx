import { Button } from '../ui/button';

export function CommitBar({
  isDirty,
  saving,
  saveError,
  onCommit,
  onDiscard,
}: {
  isDirty: boolean;
  saving: boolean;
  saveError: string | null;
  onCommit: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {isDirty ? 'You have unsaved changes' : 'No pending changes'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDiscard}
            disabled={!isDirty || saving}
          >
            Discard
          </Button>
          <Button
            size="sm"
            onClick={onCommit}
            disabled={!isDirty || saving}
          >
            {saving ? 'Committing...' : 'Commit changes'}
          </Button>
        </div>
      </div>
      {saveError && (
        <p className="text-xs text-destructive text-center pb-2">{saveError}</p>
      )}
    </div>
  );
}
