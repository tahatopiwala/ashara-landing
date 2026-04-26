import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { fetchCity } from '../../api/cities';
import { updateCityAbout } from '../../api/admin';
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
import type {
  Activity,
  Attraction,
  CityAbout,
  CityProfile,
} from '../../../../shared/types';

type DraftUpdater = (updater: (d: CityAbout) => CityAbout) => void;

export function AdminAboutCityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [city, setCity] = useState<CityProfile | null>(null);
  const [draft, setDraft] = useState<CityAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!citySlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCity(citySlug)
      .then(({ city }) => {
        if (cancelled) return;
        setCity(city);
        setDraft(city.about);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !city || !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{error || 'City not found'}</p>
      </div>
    );
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(city.about);

  const updateDraft: DraftUpdater = (updater) => {
    setDraft((d) => (d ? updater(d) : d));
  };

  async function commit() {
    if (!citySlug || !draft) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateCityAbout(citySlug, draft);
      setCity((c) => (c ? { ...c, about: draft } : c));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (!city) return;
    setDraft(city.about);
    setSaveError(null);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-1 gap-3">
          <h1 className="text-3xl font-bold">Edit About — {city.name}</h1>
          <Link
            to={citySlug ? `/cities/${citySlug}/map` : '/map'}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0"
          >
            View public page
          </Link>
        </div>
        <p className="text-muted-foreground">
          Edit any section below. Click Commit changes at the bottom to save.
        </p>
      </div>

      <div className="space-y-6">
        <FactsSection draft={draft} updateDraft={updateDraft} />
        <DescriptionSection draft={draft} updateDraft={updateDraft} />
        <AttractionsSection draft={draft} updateDraft={updateDraft} />
        <ActivitiesSection draft={draft} updateDraft={updateDraft} />
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

// ===== Section: Facts (population, altitude, keyFacts) =====

function FactsSection({
  draft,
  updateDraft,
}: {
  draft: CityAbout;
  updateDraft: DraftUpdater;
}) {
  const [newFact, setNewFact] = useState('');

  function addFact() {
    const trimmed = newFact.trim();
    if (!trimmed) return;
    updateDraft((d) => ({ ...d, keyFacts: [...d.keyFacts, trimmed] }));
    setNewFact('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Facts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Population">
            <Input
              value={draft.population}
              onChange={(e) =>
                updateDraft((d) => ({ ...d, population: e.target.value }))
              }
            />
          </Field>
          <Field label="Altitude">
            <Input
              value={draft.altitude}
              onChange={(e) =>
                updateDraft((d) => ({ ...d, altitude: e.target.value }))
              }
            />
          </Field>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Facts</label>
          <ul className="space-y-1.5 mt-1.5">
            {draft.keyFacts.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-1.5"
              >
                <span className="text-sm">{f}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    updateDraft((d) => ({
                      ...d,
                      keyFacts: d.keyFacts.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </li>
            ))}
            {draft.keyFacts.length === 0 && (
              <li className="text-xs text-muted-foreground italic">
                No facts yet.
              </li>
            )}
          </ul>
          <div className="flex gap-2 mt-2">
            <Input
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFact();
                }
              }}
              placeholder="Add a fact..."
            />
            <Button variant="secondary" size="sm" onClick={addFact}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Section: Description =====

function DescriptionSection({
  draft,
  updateDraft,
}: {
  draft: CityAbout;
  updateDraft: DraftUpdater;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the City</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={draft.description}
          onChange={(e) =>
            updateDraft((d) => ({ ...d, description: e.target.value }))
          }
          rows={6}
          placeholder="Describe the city..."
        />
      </CardContent>
    </Card>
  );
}

// ===== Section: Attractions =====

function AttractionsSection({
  draft,
  updateDraft,
}: {
  draft: CityAbout;
  updateDraft: DraftUpdater;
}) {
  const [form, setForm] = useState(emptyAttractionForm());
  const [error, setError] = useState<string | null>(null);

  function add() {
    const name = form.name.trim();
    if (!name) {
      setError('Name is required');
      return;
    }
    const next: Attraction = {
      id: crypto.randomUUID(),
      name,
      distance: form.distance.trim(),
      description: form.description.trim(),
      highlights: form.highlights
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean),
      imageKey: '',
    };
    updateDraft((d) => ({ ...d, attractions: [...d.attractions, next] }));
    setForm(emptyAttractionForm());
    setError(null);
  }

  function remove(id: string) {
    updateDraft((d) => ({
      ...d,
      attractions: d.attractions.filter((a) => a.id !== id),
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Attractions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {draft.attractions.length > 0 ? (
          <ul className="space-y-2">
            {draft.attractions.map((a) => (
              <li
                key={a.id}
                className="rounded-md border bg-card px-3 py-2 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{a.name}</span>
                      {a.distance && (
                        <Badge variant="secondary" className="text-xs">
                          {a.distance}
                        </Badge>
                      )}
                    </div>
                    {a.description && (
                      <p className="text-muted-foreground mt-0.5">
                        {a.description}
                      </p>
                    )}
                    {a.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {a.highlights.map((h, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {h}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(a.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No attractions added.
          </p>
        )}

        <div className="rounded-md border border-dashed p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Add attraction
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Distance">
              <Input
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                placeholder="e.g. ~150 km"
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
            />
          </Field>
          <Field label="Highlights (comma-separated)">
            <Input
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder="Tigers, Safari, Photography"
            />
          </Field>
          <div className="flex justify-between items-center">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <span />
            )}
            <Button variant="secondary" size="sm" onClick={add}>
              Add attraction
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function emptyAttractionForm() {
  return { name: '', distance: '', description: '', highlights: '' };
}

// ===== Section: Activities =====

function ActivitiesSection({
  draft,
  updateDraft,
}: {
  draft: CityAbout;
  updateDraft: DraftUpdater;
}) {
  const [form, setForm] = useState(emptyActivityForm());
  const [error, setError] = useState<string | null>(null);

  function add() {
    const title = form.title.trim();
    if (!title) {
      setError('Title is required');
      return;
    }
    const next: Activity = {
      id: crypto.randomUUID(),
      title,
      description: form.description.trim(),
      season: form.season.trim(),
      icon: '',
    };
    updateDraft((d) => ({ ...d, activities: [...d.activities, next] }));
    setForm(emptyActivityForm());
    setError(null);
  }

  function remove(id: string) {
    updateDraft((d) => ({
      ...d,
      activities: d.activities.filter((a) => a.id !== id),
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {draft.activities.length > 0 ? (
          <ul className="space-y-2">
            {draft.activities.map((a) => (
              <li
                key={a.id}
                className="rounded-md border bg-card px-3 py-2 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{a.title}</span>
                      {a.season && (
                        <Badge variant="secondary" className="text-xs">
                          {a.season}
                        </Badge>
                      )}
                    </div>
                    {a.description && (
                      <p className="text-muted-foreground mt-0.5">
                        {a.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(a.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No activities added.
          </p>
        )}

        <div className="rounded-md border border-dashed p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Add activity
          </p>
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
            />
          </Field>
          <Field label="Season">
            <Input
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              placeholder="e.g. Oct-Jun"
            />
          </Field>
          <div className="flex justify-between items-center">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <span />
            )}
            <Button variant="secondary" size="sm" onClick={add}>
              Add activity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function emptyActivityForm() {
  return { title: '', description: '', season: '' };
}

// ===== Shared bits =====

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
