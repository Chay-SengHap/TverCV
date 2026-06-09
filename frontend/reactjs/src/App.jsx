import Banner from "./components/banner";
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HeroSection from "./sections/hero-section";
import WhatWeDoSection from "./sections/what-we-do-section";
import OurLatestCreations from "./sections/our-latest-creations";
import OurTestimonialSection from "./sections/our-testimonials-section";
import FaqSection from "./sections/faq-section";
import Newsletter from "./sections/newsletter";

export default function App() {
    return (
        <>
            <LenisScroll />
            <Banner />
            <Navbar />
            <main className='px-4'>
                <HeroSection />
                <WhatWeDoSection />
                <OurLatestCreations />
                <OurTestimonialSection />
                <FaqSection />
                <Newsletter />
            </main>
            <Footer />
        </>
    );
}