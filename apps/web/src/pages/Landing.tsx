import React from 'react';
import { Navigation } from '../components/sections/Navigation';
import { Hero } from '../components/sections/Hero';
import { RealityCheck } from '../components/sections/RealityCheck';
import { StudentJourney } from '../components/sections/StudentJourney';
import { ResourceHubShowcase } from '../components/sections/ResourceHubShowcase';
import { AIFeatures } from '../components/sections/AIFeatures';
import { DashboardPreview } from '../components/sections/DashboardPreview';
import { CareerHub } from '../components/sections/CareerHub';
import { AlumniNetwork } from '../components/sections/AlumniNetwork';
import { FacultySection } from '../components/sections/FacultySection';
import { SocialProof } from '../components/sections/SocialProof';
import { Testimonials } from '../components/sections/Testimonials';
import { Pricing } from '../components/sections/Pricing';
import { CTASection } from '../components/sections/CTASection';
import { Footer } from '../components/sections/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-quad/30 antialiased font-body transition-colors duration-200">
      
      {/* 1. Navigation */}
      <Navigation />
      
      <main>
        {/* 2. Hero Stack & Signature Ledger Panel */}
        <Hero />
        
        {/* 3. Reality Check (Chaos to order transition) */}
        <RealityCheck />
        
        {/* 4. Student Journey Horizontal Timeline */}
        <StudentJourney />
        
        {/* 5. Resource Hub Showcase Ledger Table */}
        <ResourceHubShowcase />
        
        {/* 6. AI Features Step Chains */}
        <AIFeatures />
        
        {/* 7. Dashboard Preview Transcript */}
        <DashboardPreview />
        
        {/* 8. Career Hub Timeline & Internship Cards */}
        <CareerHub />
        
        {/* 9. Alumni Network Career Prerequisite branching tree */}
        <AlumniNetwork />
        
        {/* 10. Faculty Section capability rows */}
        <FacultySection />
        
        {/* 11. Social Proof Footnotes Row */}
        <SocialProof />
        
        {/* 12. Testimonials (Initials avatars & Inter quotes) */}
        <Testimonials />
        
        {/* 13. Pricing Plan columns */}
        <Pricing />
        
        {/* 14. Final CTA Section */}
        <CTASection />
      </main>

      {/* 15. Footer */}
      <Footer />
      
    </div>
  );
};