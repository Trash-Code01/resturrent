import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SmoothScroll from './components/common/SmoothScroll';
import LoadingScreen from './components/common/LoadingScreen';
import Layout from './components/layout/Layout';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import { ADMIN_ACCESS_ROUTE, ADMIN_PANEL_ROUTE } from './lib/routes';

const Menu = lazy(() => import('./pages/Menu'));
const Reservation = lazy(() => import('./pages/Reservation'));
const Story = lazy(() => import('./pages/Story'));
const Contact = lazy(() => import('./pages/Contact'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminAccessPage = lazy(() => import('./pages/AdminAccessPage'));

function App() {
  return (
    <SmoothScroll>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingScreen label="Loading page" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservations" element={<Reservation />} />
              <Route path="/story" element={<Story />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path={ADMIN_ACCESS_ROUTE} element={<AdminAccessPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/my-account" element={<MyAccount />} />
              </Route>
              <Route
                path={ADMIN_PANEL_ROUTE}
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin"
                element={<Navigate to={ADMIN_PANEL_ROUTE} replace />}
              />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </SmoothScroll>
  );
}

export default App;
