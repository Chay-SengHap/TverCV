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
      <main className='px-4'>
        <Navbar />
        <HeroSection />
        <WhatWeDoSection />
        <OurLatestCreations />
        <OurTestimonialSection />
        <FaqSection />
        <Newsletter />
        <Footer />
      </main>
    </div>
  )
}

export default Home