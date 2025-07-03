
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import PortfolioSection from '@/components/PortfolioSection';
import CostCalculator from '@/components/CostCalculator';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollProgress from '@/components/ScrollProgress';
import PerformanceIndicators from '@/components/PerformanceIndicators';
import ChatWidget from '@/components/ChatWidget';
import TrustNotification from '@/components/TrustNotification';
import AppointmentCalendar from '@/components/AppointmentCalendar';

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ScrollProgress />
      <Header />
      <section id="hero">
        <HeroSection />
      </section>
      <div className="bg-gray-50 dark:bg-gray-800">
        <AboutSection />
      </div>
      <div className="bg-white dark:bg-gray-900">
        <ServicesSection />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800">
        <ProcessSection />
      </div>
      <div className="bg-white dark:bg-gray-900">
        <PerformanceIndicators />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800">
        <PortfolioSection />
      </div>
      <div className="bg-white dark:bg-gray-900">
        <CostCalculator />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800">
        <PricingSection />
      </div>
      <div className="bg-white dark:bg-gray-900">
        <TestimonialsSection />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800">
        <AppointmentCalendar />
      </div>
      <div className="bg-white dark:bg-gray-900">
        <FAQSection />
      </div>
      <div className="bg-gray-50 dark:bg-gray-800">
        <ContactSection />
      </div>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
      <TrustNotification />
    </div>
  );
};

export default Index;
