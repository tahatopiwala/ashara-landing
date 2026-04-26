import { Outlet } from 'react-router';
import { CityProvider } from '../context/CityContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function MainLayout() {
  return (
    <CityProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CityProvider>
  );
}
