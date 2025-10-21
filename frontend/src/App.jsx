import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';
import BusinessOnboarding from './pages/auth/BusinessOnboarding';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import BusinessProfile from './pages/BusinessProfile';
import CreateDealPage from './pages/business/CreateDealPage';
import UpdateDealPage from './pages/business/UpdateDealPage';
import BusinessDealsPage from './pages/business/BusinessDealsPage';
import MySubscriptionsPage from './pages/MySubscriptionsPage';
import MySubscribersPage from './pages/business/MySubscribersPage';
import ProfilePage from './pages/ProfilePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import PaymentAccountSuccessPage from './pages/PaymentAccountSuccessPage';
import ReferralPage from './pages/ReferralPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import HelpCenterPage from './pages/HelpCenterPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/deal/:dealId" element={<DealDetailPage />} />
              <Route path="/business/:businessId" element={<BusinessProfile />} />
              <Route path="/ref/:refId" element={<ReferralPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/failure" element={<PaymentFailurePage />} />
              <Route path="/payment-account/success" element={<PaymentAccountSuccessPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/otp-verification" element={<OTPVerificationPage />} />
              <Route path="/business-onboarding" element={<BusinessOnboarding />} />
              
              {/* Protected Routes - Business Only */}
              <Route 
                path="/create-deal" 
                element={
                  <ProtectedRoute allowedUserTypes={['business']}>
                    <CreateDealPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/update-deal/:dealId" 
                element={
                  <ProtectedRoute allowedUserTypes={['business']}>
                    <UpdateDealPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business/deals" 
                element={
                  <ProtectedRoute allowedUserTypes={['business']}>
                    <BusinessDealsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-subscribers" 
                element={
                  <ProtectedRoute allowedUserTypes={['business']}>
                    <MySubscribersPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Customer Only */}
              <Route 
                path="/my-subscriptions" 
                element={
                  <ProtectedRoute allowedUserTypes={['customer']}>
                    <MySubscriptionsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Both */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedUserTypes={['customer', 'business']}>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
