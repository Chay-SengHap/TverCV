import { MenuIcon, XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const links = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -50% 0px', // Triggers when the section is in the middle of viewport
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        links.forEach((link) => {
            const targetId = link.href.slice(1);
            const el = document.getElementById(targetId);
            if (el) {
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <nav className='sticky top-0 z-50 flex w-full items-center justify-between bg-white/85 px-4 py-3.5 backdrop-blur-md border-b border-slate-100 md:px-8 lg:px-16'>
                <a href='#home' className="flex items-center">
                    <img src='/assets/logoTverCv.png' alt='logo' className='h-8 w-auto' />
                </a>

                <div className='hidden items-center space-x-8 md:flex'>
                    {links.map((link) => {
                        const targetId = link.href.slice(1);
                        const isActive = activeSection === targetId;
                        return (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className={`transition-all duration-200 text-sm relative py-1 ${
                                    isActive 
                                        ? 'text-red-500 font-bold' 
                                        : 'text-slate-600 font-medium hover:text-red-500'
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </a>
                        );
                    })}
                </div>

                <div className='hidden items-center gap-3 md:flex'>
                    <Link to='/app?state=register' className='rounded-full bg-gradient-to-r from-[#e52d27] to-[#b31217] px-6 py-2 font-semibold text-white text-sm transition hover:opacity-90 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer'>
                        Get Start
                    </Link>
                    <Link to='/app?state=login' className='rounded-full border-2 border-red-500/80 px-6 py-1.5 font-semibold text-red-500 text-sm transition hover:bg-red-50 cursor-pointer'>
                        Login
                    </Link>
                </div>

                <button onClick={() => setIsOpen(true)} className='transition active:scale-90 md:hidden p-1 text-slate-700'>
                    <MenuIcon className='size-6' />
                </button>
            </nav>

            {/* Mobile Navigation Backdrop & Drawer */}
            <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop overlay */}
                <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"></div>

                {/* Right Drawer Panel */}
                <div className={`absolute top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="space-y-8">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <img src='/assets/logoTverCv.png' alt='logo' className='h-7 w-auto' />
                            <button onClick={() => setIsOpen(false)} className='p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition active:scale-95'>
                                <XIcon className="size-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col gap-1">
                            {links.map((link) => {
                                const targetId = link.href.slice(1);
                                const isActive = activeSection === targetId;
                                return (
                                    <a 
                                        key={link.name} 
                                        href={link.href} 
                                        className={`px-4 py-3 rounded-xl font-semibold text-base transition duration-150 ${
                                            isActive 
                                                ? 'bg-red-50 text-red-500' 
                                                : 'text-slate-700 hover:bg-slate-50 hover:text-red-500'
                                        }`} 
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                        <Link 
                            to='/app?state=login' 
                            className='w-full text-center rounded-full border border-red-500/80 py-2.5 font-bold text-red-500 text-sm transition hover:bg-red-50'
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </Link>
                        <Link 
                            to='/app?state=register' 
                            className='w-full text-center rounded-full bg-gradient-to-r from-[#e52d27] to-[#b31217] py-2.5 font-bold text-white text-sm transition hover:opacity-95 hover:shadow-lg hover:shadow-red-500/10'
                            onClick={() => setIsOpen(false)}
                        >
                            Get Start
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
