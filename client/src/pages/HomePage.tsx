import { useCity } from '../context/CityContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CountdownTimer } from '../components/home/CountdownTimer';
import { WeatherWidget } from '../components/home/WeatherWidget';
import { TaabudaatDashboard } from '../components/home/TaabudaatDashboard';
import { LatestNews } from '../components/home/LatestNews';
import { ZoneOverview } from '../components/home/ZoneOverview';

export function HomePage() {
  const { loading, error } = useCity();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <HeroBanner />
      <CountdownTimer />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TaabudaatDashboard />
          </div>
          <div>
            <WeatherWidget />
          </div>
        </div>
      </div>
      <LatestNews />
      <ZoneOverview />
    </div>
  );
}
