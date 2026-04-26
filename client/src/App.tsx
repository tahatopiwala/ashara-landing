import { BrowserRouter, Routes, Route } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ZonesPage } from './pages/ZonesPage';
import { AboutCityPage } from './pages/AboutCityPage';
import { TransportationPage } from './pages/TransportationPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { TaabudaatPage } from './pages/TaabudaatPage';
import { AdminAboutCityPage } from './pages/admin/AdminAboutCityPage';

function PageRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="zones" element={<ZonesPage />} />
      <Route path="map" element={<AboutCityPage />} />
      <Route path="transportation" element={<TransportationPage />} />
      <Route path="news" element={<NewsPage />} />
      <Route path="news/:id" element={<NewsArticlePage />} />
      <Route path="taabudaat" element={<TaabudaatPage />} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main domain routes (active city) */}
        <Route element={<MainLayout />}>
          {PageRoutes()}
        </Route>

        {/* City-specific routes */}
        <Route path="cities/:citySlug" element={<MainLayout />}>
          {PageRoutes()}
        </Route>

        {/* Admin routes */}
        <Route path="admin/cities/:citySlug" element={<MainLayout />}>
          <Route path="about" element={<AdminAboutCityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
