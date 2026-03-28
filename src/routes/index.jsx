import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicRoute from '@/routes/PublicRoute';
import AdminRoute from '@/routes/AdminRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import Spinner from '@/components/ui/Spinner';

const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const Team = lazy(() => import('@/pages/public/Team'));
const Members = lazy(() => import('@/pages/public/Members'));
const Notices = lazy(() => import('@/pages/public/Notices'));
const NoticeDetail = lazy(() => import('@/pages/public/NoticeDetail'));
const LegalUpdates = lazy(() => import('@/pages/public/LegalUpdates'));
const LegalUpdateDetail = lazy(() => import('@/pages/public/LegalUpdateDetail'));
const Documents = lazy(() => import('@/pages/public/Documents'));
const Gallery = lazy(() => import('@/pages/public/Gallery'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const LinksPage = lazy(() => import('@/pages/public/Links'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

const Login = lazy(() => import('@/pages/admin/Login'));
const Signup = lazy(() => import('@/pages/admin/Signup'));
const ForgotPassword = lazy(() => import('@/pages/admin/ForgotPassword'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminNotices = lazy(() => import('@/pages/admin/AdminNotices'));
const AdminLegalUpdates = lazy(() => import('@/pages/admin/AdminLegalUpdates'));
const AdminDocuments = lazy(() => import('@/pages/admin/AdminDocuments'));
const AdminGallery = lazy(() => import('@/pages/admin/AdminGallery'));
const AdminTeam = lazy(() => import('@/pages/admin/AdminTeam'));
const AdminMembers = lazy(() => import('@/pages/admin/AdminMembers'));
const AdminContactSubmissions = lazy(() => import('@/pages/admin/AdminContactSubmissions'));
const AdminLinks = lazy(() => import('@/pages/admin/AdminLinks'));
const Profile = lazy(() => import('@/pages/admin/Profile'));

const withSuspense = (node) => <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><Spinner className="h-6 w-6" /></div>}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'team', element: withSuspense(<Team />) },
      { path: 'members', element: withSuspense(<Members />) },
      { path: 'notices', element: withSuspense(<Notices />) },
      { path: 'notices/:slug', element: withSuspense(<NoticeDetail />) },
      { path: 'legal-updates', element: withSuspense(<LegalUpdates />) },
      { path: 'legal-updates/:slug', element: withSuspense(<LegalUpdateDetail />) },
      { path: 'documents', element: withSuspense(<Documents />) },
      { path: 'gallery', element: withSuspense(<Gallery />) },
      { path: 'contact', element: withSuspense(<Contact />) },
      { path: 'links', element: withSuspense(<LinksPage />) }
    ]
  },
  { path: '/admin/login', element: withSuspense(<Login />) },
  { path: '/admin/signup', element: withSuspense(<Signup />) },
  { path: '/admin/forgot-password', element: withSuspense(<ForgotPassword />) },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: withSuspense(<Dashboard />) },
          { path: 'notices', element: withSuspense(<AdminNotices />) },
          { path: 'legal-updates', element: withSuspense(<AdminLegalUpdates />) },
          { path: 'documents', element: withSuspense(<AdminDocuments />) },
          { path: 'gallery', element: withSuspense(<AdminGallery />) },
          { path: 'links', element: withSuspense(<AdminLinks />) },
          { path: 'team', element: withSuspense(<AdminTeam />) },
          { path: 'members', element: withSuspense(<AdminMembers />) },
          { path: 'contact-submissions', element: withSuspense(<AdminContactSubmissions />) },
          { path: 'profile', element: withSuspense(<Profile />) }
        ]
      }
    ]
  },
  { path: '*', element: withSuspense(<NotFound />) }
]);
