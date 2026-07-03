import React from 'react';
import HeroSection from '../components/home/Hero-section';
import WhatWeDoSection from '../components/home/What-we-do-section';
import OurLatestCreations from '../components/home/Our-latest-creations';
import OurTestimonialSection from '../components/home/Our-testimonials-section';
import FaqSection from '../components/home/Faq-section';
import Newsletter from '../components/home/Newsletter';
import Banner from '../components/home/Banner';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="space-y-6 sm:space-y-10">
        <div id="home" className="scroll-mt-20">
          <HeroSection />
        </div>
        <div id="features" className="scroll-mt-20">
          <WhatWeDoSection />
        </div>
        <div id="testimonials" className="scroll-mt-20">
          <OurTestimonialSection />
        </div>
        <div id="contact" className="scroll-mt-20">
          <Footer />
        </div>
      </main>
    </div>
  )
}

export default Home