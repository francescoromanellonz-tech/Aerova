import { useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  Outlet,
} from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WaterCursor from './components/WaterCursor';
import PageTransition from './components/PageTransition';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderCancelPage = lazy(() => import('./pages/OrderCancelPage'));

// Maps URL prefix → internal language code
const URL_TO_LANG = { vi: 'vi', ru: 'ru', fr: 'fr', zh: 'zh' };
const VALID_PREFIXES = ['vi', 'ru', 'fr', 'zh'];

// LangWrapper: reads :lang from URL, sets language context
function LangWrapper() {
  const { lang } = useParams();
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    if (!VALID_PREFIXES.includes(lang)) return;
    const internalCode = URL_TO_LANG[lang];
    changeLanguage(internalCode);
  }, [lang, changeLanguage]);

  if (!VALID_PREFIXES.includes(lang)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// EnglishWrapper: resets language to 'en' when visiting unprefixed routes
function EnglishWrapper() {
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    changeLanguage('en');
  }, [changeLanguage]);

  return <Outlet />;
}

// All page routes — reusable for root and /:lang
function pageRoutes(prefix = '') {
  const p = prefix ? prefix + '-' : '';
  return [
    <Route key={p+'home'} index element={<HomePage />} />,
    <Route key={p+'product'} path="product" element={<ProductPage />} />,
    <Route key={p+'about'} path="about" element={<AboutPage />} />,
    <Route key={p+'service'} path="service" element={<ServicePage />} />,
    <Route key={p+'blog'} path="blog" element={<BlogPage />} />,
    <Route key={p+'contact'} path="contact" element={<ContactPage />} />,
    <Route key={p+'faq'} path="faq" element={<FaqPage />} />,
    <Route key={p+'support'} path="support" element={<SupportPage />} />,
    <Route key={p+'business'} path="business" element={<BusinessPage />} />,
    <Route key={p+'pp'} path="privacy-policy" element={<PrivacyPolicyPage />} />,
    <Route key={p+'tc'} path="terms-and-conditions" element={<TermsAndConditionsPage />} />,
    <Route key={p+'legal'} path="legal" element={<LegalPage />} />,
    <Route key={p+'order-success'} path="order-success" element={<OrderSuccessPage />} />,
    <Route key={p+'order-cancel'}  path="order-cancel"  element={<OrderCancelPage />} />,
  ];
}

function App() {
  return (
    <Router>
      <WaterCursor />
      <ScrollToTop />
      <Navbar />
      <PageTransition>
        <main>
          <Suspense fallback={null}>
            <Routes>
              {/* English routes — no prefix */}
              <Route path="/" element={<EnglishWrapper />}>
                {pageRoutes('en')}
              </Route>

              {/* Prefixed routes for vi, ru, fr, zh */}
              <Route path="/:lang" element={<LangWrapper />}>
                {pageRoutes('lang')}
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </PageTransition>
      <Footer />
    </Router>
  );
}

export default App;
