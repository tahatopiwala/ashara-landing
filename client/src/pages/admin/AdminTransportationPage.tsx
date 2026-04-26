import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useCity } from '../../context/CityContext';
import { apiFetch } from '../../api/client';
import { updateTransportation } from '../../api/admin';
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
import type {
  CityTransportation,
  TransportHub,
} from '../../../../shared/types';

type EditableTransportation = Omit<CityTransportation, 'citySlug'>;

export function AdminTransportationPage() {
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
  } = useDraftResource<EditableTransportation>(
    citySlug,
    () =>
      apiFetch<{ transportation: CityTransportation }>(
        `/cities/${citySlug}/transportation`
      ).then(({ transportation }) => {
        const { citySlug: _slug, ...rest } = transportation;
        return rest;
      }),
    (data) => updateTransportation(citySlug!, data)
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
        <p className="text-destructive">
          {loadError || 'Transportation info not available'}
        </p>
      </div>
    );
  }

  function setHubs(
    key: 'airports' | 'railwayStations',
    value: TransportHub[]
  ) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-1 gap-3">
          <h1 className="text-3xl font-bold">
            Edit Transportation — {city?.name || ''}
          </h1>
          <Link
            to={citySlug ? `/cities/${citySlug}/transportation` : '/transportation'}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0"
          >
            View public page
          </Link>
        </div>
        <p className="text-muted-foreground">
          Manage airports, railway stations, and travel tips. Commit at the
          bottom to save.
        </p>
      </div>

      <div className="space-y-6">
        <HubsSection
          title="Airports"
          hubs={draft.airports}
          onChange={(v) => setHubs('airports', v)}
        />
        <HubsSection
          title="Railway Stations"
          hubs={draft.railwayStations}
          onChange={(v) => setHubs('railwayStations', v)}
        />
        <TravelTipsSection
          tips={draft.travelTips}
          onChange={(v) =>
            setDraft((d) => (d ? { ...d, travelTips: v } : d))
          }
        />
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

// ===== Hubs section (used for both airports and railway stations) =====

function HubsSection({
  title,
  hubs,
  onChange,
}: {
  title: string;
  hubs: TransportHub[];
  onChange: (hubs: TransportHub[]) => void;
}) {
  const [form, setForm] = useState(emptyHubForm());
  const [error, setError] = useState<string | null>(null);

  function add() {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    const next: TransportHub = {
      name: form.name.trim(),
      code: form.code.trim(),
      address: form.address.trim(),
      facilities: parseList(form.facilities),
      transportOptions: parseList(form.transportOptions),
    };
    onChange([...hubs, next]);
    setForm(emptyHubForm());
    setError(null);
  }

  function update(i: number, patch: Partial<TransportHub>) {
    onChange(hubs.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  }

  function remove(i: number) {
    onChange(hubs.filter((_, idx) => idx !== i));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hubs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            None added yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {hubs.map((h, i) => (
              <li
                key={i}
                className="rounded-md border bg-card p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-2 flex-1">
                    <Field label="Name">
                      <Input
                        value={h.name}
                        onChange={(e) => update(i, { name: e.target.value })}
                      />
                    </Field>
                    <Field label="Code">
                      <Input
                        value={h.code}
                        onChange={(e) => update(i, { code: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(i)}
                  >
                    Remove
                  </Button>
                </div>
                <Field label="Address">
                  <Input
                    value={h.address}
                    onChange={(e) => update(i, { address: e.target.value })}
                  />
                </Field>
                <Field label="Facilities (comma-separated)">
                  <Input
                    value={h.facilities.join(', ')}
                    onChange={(e) =>
                      update(i, { facilities: parseList(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Transport options (comma-separated)">
                  <Input
                    value={h.transportOptions.join(', ')}
                    onChange={(e) =>
                      update(i, {
                        transportOptions: parseList(e.target.value),
                      })
                    }
                  />
                </Field>
                {(h.facilities.length > 0 ||
                  h.transportOptions.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {h.facilities.map((f, j) => (
                      <Badge
                        key={`f-${j}`}
                        variant="outline"
                        className="text-xs"
                      >
                        {f}
                      </Badge>
                    ))}
                    {h.transportOptions.map((t, j) => (
                      <Badge
                        key={`t-${j}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-md border border-dashed p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Add {title.toLowerCase().replace(/s$/, '')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-2">
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Code">
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Address">
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <Field label="Facilities (comma-separated)">
            <Input
              value={form.facilities}
              onChange={(e) =>
                setForm({ ...form, facilities: e.target.value })
              }
            />
          </Field>
          <Field label="Transport options (comma-separated)">
            <Input
              value={form.transportOptions}
              onChange={(e) =>
                setForm({ ...form, transportOptions: e.target.value })
              }
            />
          </Field>
          <div className="flex justify-between items-center">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <span />
            )}
            <Button variant="secondary" size="sm" onClick={add}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function emptyHubForm() {
  return {
    name: '',
    code: '',
    address: '',
    facilities: '',
    transportOptions: '',
  };
}

function parseList(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

// ===== Travel tips section =====

function TravelTipsSection({
  tips,
  onChange,
}: {
  tips: string[];
  onChange: (tips: string[]) => void;
}) {
  const [newTip, setNewTip] = useState('');

  function add() {
    const trimmed = newTip.trim();
    if (!trimmed) return;
    onChange([...tips, trimmed]);
    setNewTip('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No tips yet.
          </p>
        ) : (
          <ol className="space-y-1.5 list-decimal list-inside">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-2 rounded-md border bg-card px-3 py-1.5"
              >
                <span className="text-sm flex-1">{tip}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onChange(tips.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ol>
        )}
        <div className="flex gap-2">
          <Textarea
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            rows={2}
            placeholder="Add a travel tip..."
          />
          <Button variant="secondary" size="sm" onClick={add}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Field helper =====

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
