import { useCity } from '../../context/CityContext';

export function Footer() {
  const { city, event } = useCity();

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {event?.name || 'Ashara Mubaraka'}{' '}
            {event?.year || ''}
            {city ? ` — ${city.name}` : ''}
          </p>
          {city?.contactEmail && (
            <p>
              Contact:{' '}
              <a
                href={`mailto:${city.contactEmail}`}
                className="underline hover:text-foreground"
              >
                {city.contactEmail}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
