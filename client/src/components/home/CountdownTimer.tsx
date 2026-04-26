import { useCity } from '../../context/CityContext';
import { useCountdown } from '../../hooks/useCountdown';
import { Card, CardContent } from '../ui/card';

export function CountdownTimer() {
  const { event } = useCity();
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    event?.startDate || null
  );

  if (!event) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {event.hijriYear}
        </h2>
        {isExpired ? (
          <p className="text-center text-muted-foreground">
            The event has begun!
          </p>
        ) : (
          <div className="flex justify-center gap-4">
            {[
              { label: 'Days', value: days },
              { label: 'Hours', value: hours },
              { label: 'Minutes', value: minutes },
              { label: 'Seconds', value: seconds },
            ].map(({ label, value }) => (
              <Card key={label} className="w-24">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-mono font-bold">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
