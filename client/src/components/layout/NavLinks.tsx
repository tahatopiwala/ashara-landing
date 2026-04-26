import { Link, useLocation } from 'react-router';
import { useCity } from '../../context/CityContext';

const NAV_ITEMS = [
  { label: 'Home', path: '' },
  { label: 'Zones', path: '/zones' },
  { label: 'About City', path: '/map' },
  { label: 'Transportation', path: '/transportation' },
  { label: 'News', path: '/news' },
  { label: 'Taabudaat Amal', path: '/taabudaat' },
];

export function NavLinks() {
  const { citySlug } = useCity();
  const location = useLocation();

  // Determine if we're on a city-specific path
  const isCityPath = location.pathname.startsWith('/cities/');
  const prefix = isCityPath ? `/cities/${citySlug}` : '';

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const href = `${prefix}${item.path}` || '/';
        const isActive =
          location.pathname === href ||
          (item.path === '' && (location.pathname === '/' || location.pathname === `/cities/${citySlug}`));

        return (
          <Link
            key={item.path}
            to={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
