import { Facebook, Instagram, Send, Github } from "lucide-react";

export default function Footer() {
    const columns = [
        {
            title: 'Contact',
            links: [
                { title: 'Contact us', href: '#contact-us' },
                { title: 'Instagram', href: '#instagram' },
                { title: 'Facebook', href: '#facebook' },
            ],
        },
        {
            title: 'About Us',
            links: [
                { title: 'Our vision', href: '#our-vision' },
                { title: 'Community', href: '#community' },
                { title: 'Term & conditions', href: '#term-and-conditions' },
            ],
        },
        {
            title: 'Features',
            links: [
                { title: 'Live Builder', href: '#features' },
                { title: 'PDF Export', href: '#features' },
                { title: 'AI Recommendations', href: '#features' },
            ],
        },
    ];

    return (
        <footer className="max-w-7xl mx-auto px-6 mt-32 pb-12 border-t border-gray-150 text-gray-500 text-sm">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16 items-start">
                
                {/* Logo Column */}
                <div className="lg:col-span-3">
                    <a href="#home" className="inline-block">
                        <img src="/assets/logoTverCv.png" alt="TverCV Logo" className="h-8 w-auto" />
                    </a>
                </div>

                {/* Navigation Columns */}
                <div className="grid grid-cols-3 gap-6 lg:col-span-6">
                    {columns.map((col, index) => (
                        <div key={index} className="space-y-4">
                            <h5 className="font-bold text-gray-900 text-sm tracking-wide">
                                {col.title}
                            </h5>
                            <ul className="space-y-2.5">
                                {col.links.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.href} className="hover:text-red-500 transition duration-200 text-xs sm:text-sm">
                                            {link.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter Column */}
                <div className="lg:col-span-3 space-y-4">
                    <h5 className="font-bold text-gray-900 text-sm tracking-wide">
                        Signup as a new User
                    </h5>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Signup now and builder your modern CV
                    </p>
                    <div className="flex items-center gap-2 max-w-sm border border-gray-300 rounded-lg overflow-hidden p-1 bg-white">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-transparent w-full px-2 py-1 text-sm outline-none border-none focus:ring-0" 
                        />
                        <button className="flex items-center justify-center bg-[#e52d27] text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-[#b31217] transition cursor-pointer">
                            Signup
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col sm:flex-row py-8 border-t border-gray-150 justify-between items-center gap-4 text-xs">
                <p className="text-center sm:text-left">
                    © 2026 TverCV, All right reserved.
                </p>
                <div className="flex items-center gap-5">
                    <a href="#facebook" className="text-gray-400 hover:text-red-500 transition duration-200">
                        <Facebook className="size-5" />
                    </a>
                    <a href="#instagram" className="text-gray-400 hover:text-red-500 transition duration-200">
                        <Instagram className="size-5" />
                    </a>
                    <a href="#telegram" className="text-gray-400 hover:text-red-500 transition duration-200">
                        <Send className="size-5" />
                    </a>
                    <a href="#github" className="text-gray-400 hover:text-red-500 transition duration-200">
                        <Github className="size-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}