import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router';
import { fetchConfig, fetchCity } from '../api/cities';
import type { CityProfile, EventConfig } from '../../../shared/types';

interface CityContextValue {
  city: CityProfile | null;
  event: EventConfig | null;
  citySlug: string;
  loading: boolean;
  error: string | null;
  role: 'public' | 'admin'; // For future auth
}

const CityContext = createContext<CityContextValue>({
  city: null,
  event: null,
  citySlug: '',
  loading: true,
  error: null,
  role: 'public',
});

export function CityProvider({ children }: { children: ReactNode }) {
  const { citySlug: paramSlug } = useParams<{ citySlug?: string }>();
  const [city, setCity] = useState<CityProfile | null>(null);
  const [event, setEvent] = useState<EventConfig | null>(null);
  const [citySlug, setCitySlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // If we have a city slug from the URL, use it.
        // Otherwise, fetch the active city from config.
        let slug = paramSlug;

        if (!slug) {
          const config = await fetchConfig();
          setEvent(config.event);
          slug = config.event.activeCitySlug;
        } else {
          // Still fetch event config for countdown etc.
          const config = await fetchConfig();
          setEvent(config.event);
        }

        if (!cancelled) {
          setCitySlug(slug);
          const { city: cityData } = await fetchCity(slug);
          if (!cancelled) {
            setCity(cityData);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load city');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [paramSlug]);

  return (
    <CityContext.Provider
      value={{ city, event, citySlug, loading, error, role: 'public' }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
