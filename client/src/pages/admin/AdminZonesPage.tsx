import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useCity } from '../../context/CityContext';
import { fetchZones } from '../../api/zones';
import { updateZones } from '../../api/admin';
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
import { CommitBar } from '../../components/admin/CommitBar';
import type { Zone } from '../../../../shared/types';

export function AdminZonesPage() {
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
  } = useDraftResource<Zone[]>(
    citySlug,
    () => fetchZones(citySlug!).then(({ zones }) => zones),
    (zones) => updateZones(citySlug!, zones)
  );

  const [form, setForm] = useState(emptyZoneForm());
  const [addError, setAddError] = useState<string | null>(null);

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
        <p className="text-destructive">{loadError || 'Zones unavailable'}</p>
      </div>
    );
  }

  function update(zoneId: string, patch: Partial<Zone>) {
    setDraft((d) =>
      d ? d.map((z) => (z.zoneId === zoneId ? { ...z, ...patch } : z)) : d
    );
  }

  function remove(zoneId: string) {
    setDraft((d) => (d ? d.filter((z) => z.zoneId !== zoneId) : d));
  }

  function add() {
    if (!citySlug) return;
    if (!form.name.trim()) {
      setAddError('Name is required');
      return;
    }
    const zoneId = form.zoneId.trim() || `zone-${crypto.randomUUID().slice(0, 8)}`;
    if (draft && draft.some((z) => z.zoneId === zoneId)) {
      setAddError('Zone ID already exists');
      return;
    }
    const next: Zone = {
      citySlug,
      zoneId,
      name: form.name.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      imageKey: '',
      distanceFromAirport: form.distanceFromAirport.trim(),
      distanceFromStation: form.distanceFromStation.trim(),
      contactPhone: form.contactPhone.trim(),
    };
    setDraft((d) => (d ? [...d, next] : [next]));
    setForm(emptyZoneForm());
    setAddError(null);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-1 gap-3">
          <h1 className="text-3xl font-bold">
            Edit Zones — {city?.name || ''}
          </h1>
          <Link
            to={citySlug ? `/cities/${citySlug}/zones` : '/zones'}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0"
          >
            View public page
          </Link>
        </div>
        <p className="text-muted-foreground">
          Edit zone details inline. Commit at the bottom to save.
        </p>
      </div>

      <div className="space-y-4">
        {draft.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground italic text-center">
                No zones yet. Add one below.
              </p>
            </CardContent>
          </Card>
        ) : (
          draft.map((z) => (
            <Card key={z.zoneId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="truncate">{z.name || z.zoneId}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(z.zoneId)}
                  >
                    Remove
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Zone ID (read-only)">
                    <Input value={z.zoneId} readOnly disabled />
                  </Field>
                  <Field label="Name">
                    <Input
                      value={z.name}
                      onChange={(e) =>
                        update(z.zoneId, { name: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea
                    value={z.description}
                    rows={2}
                    onChange={(e) =>
                      update(z.zoneId, { description: e.target.value })
                    }
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={z.location}
                    onChange={(e) =>
                      update(z.zoneId, { location: e.target.value })
                    }
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Distance from airport">
                    <Input
                      value={z.distanceFromAirport}
                      onChange={(e) =>
                        update(z.zoneId, {
                          distanceFromAirport: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Distance from station">
                    <Input
                      value={z.distanceFromStation}
                      onChange={(e) =>
                        update(z.zoneId, {
                          distanceFromStation: e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <Field label="Contact phone">
                  <Input
                    value={z.contactPhone}
                    onChange={(e) =>
                      update(z.zoneId, { contactPhone: e.target.value })
                    }
                  />
                </Field>
              </CardContent>
            </Card>
          ))
        )}

        {/* Add new zone */}
        <Card>
          <CardHeader>
            <CardTitle>Add zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Zone ID (optional, auto-generated if blank)">
                <Input
                  value={form.zoneId}
                  onChange={(e) =>
                    setForm({ ...form, zoneId: e.target.value })
                  }
                  placeholder="zone-4"
                />
              </Field>
              <Field label="Name">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={form.description}
                rows={2}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Distance from airport">
                <Input
                  value={form.distanceFromAirport}
                  onChange={(e) =>
                    setForm({ ...form, distanceFromAirport: e.target.value })
                  }
                />
              </Field>
              <Field label="Distance from station">
                <Input
                  value={form.distanceFromStation}
                  onChange={(e) =>
                    setForm({ ...form, distanceFromStation: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Contact phone">
              <Input
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
              />
            </Field>
            <div className="flex justify-between items-center">
              {addError ? (
                <p className="text-xs text-destructive">{addError}</p>
              ) : (
                <span />
              )}
              <Button variant="secondary" size="sm" onClick={add}>
                Add zone
              </Button>
            </div>
          </CardContent>
        </Card>
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

function emptyZoneForm() {
  return {
    zoneId: '',
    name: '',
    description: '',
    location: '',
    distanceFromAirport: '',
    distanceFromStation: '',
    contactPhone: '',
  };
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
