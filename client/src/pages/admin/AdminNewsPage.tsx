import { Link, useParams } from 'react-router';
import { useCity } from '../../context/CityContext';
import { fetchNews } from '../../api/news';
import { updateNews } from '../../api/admin';
import { useDraftResource } from '../../hooks/useDraftResource';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { CommitBar } from '../../components/admin/CommitBar';
import type { NewsItem } from '../../../../shared/types';

export function AdminNewsPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const { city } = useCity();

  const {
    draft,
    setDraft,
    loading,
    loadError,
    saving,
    saveError,
    isDirty,
    commit,
    discard,
  } = useDraftResource<NewsItem[]>(
    citySlug,
    () => fetchNews(citySlug!).then(({ news }) => news),
    (news) => updateNews(citySlug!, news)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (loadError || !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{loadError || 'News unavailable'}</p>
      </div>
    );
  }

  function update(id: string, patch: Partial<NewsItem>) {
    setDraft((d) =>
      d ? d.map((n) => (n.id === id ? { ...n, ...patch } : n)) : d
    );
  }

  function remove(id: string) {
    setDraft((d) => (d ? d.filter((n) => n.id !== id) : d));
  }

  function addArticle() {
    if (!citySlug) return;
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const next: NewsItem = {
      citySlug,
      id,
      timestamp,
      title: 'New article',
      content: '',
      excerpt: '',
      author: '',
      imageKey: '',
      pinned: false,
    };
    setDraft((d) => (d ? [next, ...d] : [next]));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-1 gap-3">
          <h1 className="text-3xl font-bold">
            Edit News — {city?.name || ''}
          </h1>
          <Link
            to={citySlug ? `/cities/${citySlug}/news` : '/news'}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0"
          >
            View public page
          </Link>
        </div>
        <p className="text-muted-foreground">
          Edit articles inline. Commit at the bottom to save.
        </p>
      </div>

      <div className="mb-4 flex justify-end">
        <Button variant="secondary" size="sm" onClick={addArticle}>
          Add article
        </Button>
      </div>

      <div className="space-y-4">
        {draft.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground italic text-center">
                No articles yet. Click Add article above.
              </p>
            </CardContent>
          </Card>
        ) : (
          draft.map((n) => (
            <Card key={n.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={n.title}
                      onChange={(e) =>
                        update(n.id, { title: e.target.value })
                      }
                      placeholder="Article title"
                      className="text-base font-medium"
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                      {n.pinned && (
                        <Badge variant="secondary" className="text-xs">
                          Pinned
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(n.id)}
                  >
                    Remove
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="Author">
                  <Input
                    value={n.author}
                    onChange={(e) =>
                      update(n.id, { author: e.target.value })
                    }
                  />
                </Field>
                <Field label="Excerpt">
                  <Textarea
                    value={n.excerpt}
                    rows={2}
                    onChange={(e) =>
                      update(n.id, { excerpt: e.target.value })
                    }
                    placeholder="Short summary shown in the news list"
                  />
                </Field>
                <Field label="Content">
                  <Textarea
                    value={n.content}
                    rows={6}
                    onChange={(e) =>
                      update(n.id, { content: e.target.value })
                    }
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={n.pinned}
                    onChange={(e) =>
                      update(n.id, { pinned: e.target.checked })
                    }
                  />
                  Pin this article
                </label>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CommitBar
        isDirty={isDirty}
        saving={saving}
        saveError={saveError}
        onCommit={commit}
        onDiscard={discard}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
