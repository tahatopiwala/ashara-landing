import { useCity } from '../../context/CityContext';
import { NavLinks } from './NavLinks';

export function Header() {
  const { city, event } = useCity();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">
              {event?.name || 'Ashara Mubaraka'}{' '}
              <span className="text-muted-foreground font-normal">
                {event?.year || ''}
              </span>
            </h1>
            {city && (
              <span className="text-sm text-muted-foreground">
                — {city.name}
              </span>
            )}
          </div>
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
