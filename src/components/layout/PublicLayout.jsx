import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollManager from '@/components/common/ScrollManager';

const PublicLayout = () => (
  <div className="min-h-screen bg-bg text-text">
    <ScrollManager />
    <Header />
    <main className="pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
