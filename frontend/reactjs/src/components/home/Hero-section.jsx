import { useState, useEffect } from "react";
import { ArrowRightIcon, Infinity, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import heroImg from "../../../public/assets/hero_white_bg.png";

export default function HeroSection() {
    const { user } = useSelector((state) => state.auth);

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const words = ["AI-powered resumes.", "professional CVs.", "standout profiles."];

    useEffect(() => {
        let timer;
        const currentWord = words[currentWordIndex];
        const typingSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && typedText === currentWord) {
            timer = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && typedText === "") {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
            timer = setTimeout(() => {
                setTypedText(
                    isDeleting
                        ? currentWord.substring(0, typedText.length - 1)
                        : currentWord.substring(0, typedText.length + 1)
                );
            }, typingSpeed);
        }

        return () => clearTimeout(timer);
    }, [typedText, isDeleting, currentWordIndex]);

    return (
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white pt-2 pb-10 sm:pt-4 sm:pb-14 lg:pt-4 lg:pb-16 font-['Nunito']">
            {/* Background decorative glow elements */}
            <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-red-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* Left Content Column (More compact & cleaner typography) */}
                <div className="lg:col-span-5 space-y-5 sm:space-y-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
                    
                    {/* Premium Tag Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white hover:scale-[1.02] transition-all duration-300">
                        <Sparkles className="size-3.5 text-amber-400 animate-[pulse_1.5s_infinite]" />
                        <span className="text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                            The Next Generation CV Builder
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[45px] text-gray-900 leading-[1.2] tracking-tight min-h-[72px] sm:min-h-[108px] lg:min-h-[110px]">
                        Land your dream job with{" "}
                        <span className="bg-gradient-to-r from-[#e52d27] via-[#d9383a] to-[#b31217] bg-clip-text text-transparent relative inline-block pr-1">
                            {typedText}
                            <span className="absolute right-0 top-1 bottom-1 border-r-2 border-red-500 animate-[blink_0.8s_step-end_infinite]" />
                        </span>
                    </h1>
                    
                    <p className="text-slate-500 text-sm sm:text-base max-w-md leading-relaxed mx-auto lg:mx-0 font-normal">
                        Create, edit and download professional resumes with TverCV.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 justify-center lg:justify-start">
                        <button className="flex items-center justify-center px-8 py-3 rounded-full border-2 border-red-500/80 text-red-600 font-bold hover:bg-red-50/50 active:scale-95 transition-all duration-200 cursor-pointer text-xs">
                            Demo
                        </button>
                        
                        {!user ? (
                            <Link 
                                to="/app?state=register" 
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] text-white font-bold px-8 py-3 rounded-full hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-xs"
                            >
                                Get Start <ArrowRightIcon className="size-3.5" />
                            </Link>
                        ) : (
                            <Link 
                                to="/app" 
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] text-white font-bold px-8 py-3 rounded-full hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-xs"
                            >
                                Dashboard <ArrowRightIcon className="size-3.5" />
                            </Link>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200/80 w-full max-w-md">
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">12.5K</h3>
                            <p className="text-gray-500 text-[10px] sm:text-xs font-semibold">Careers Accelerated</p>
                        </div>
                        <div className="space-y-1 border-l border-gray-200 pl-4 sm:pl-6">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">8</h3>
                            <p className="text-gray-500 text-[10px] sm:text-xs font-semibold">Free Templates</p>
                        </div>
                        <div className="space-y-1 border-l border-gray-200 pl-4 sm:pl-6">
                            <div className="flex items-center justify-center lg:justify-start gap-1 h-7 sm:h-8">
                                <Infinity className="size-6 sm:size-7 text-gray-900" />
                            </div>
                            <p className="text-gray-500 text-[10px] sm:text-xs font-semibold">Infinity CV build</p>
                        </div>
                    </div>
                </div>

                {/* Right Image Column (Larger and fully responsive) */}
                <div className="lg:col-span-7 flex items-center justify-center lg:justify-end order-1 lg:order-2 w-full">
                    <div className="relative w-full max-w-md sm:max-w-xl lg:max-w-none px-4 sm:px-0 lg:translate-x-6">
                        {/* Soft visual floating background effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-blue-500/5 rounded-3xl blur-2xl -z-10"></div>
                        <img
                            className="w-full h-auto drop-shadow-2xl rounded-2xl transform hover:scale-[1.03] transition-all duration-500 animate-[float_6s_ease-in-out_infinite]"
                            src={"https://resume.io/assets/landing/home/hero/typing-hero-e5eba566.png"}
                            alt="Clean AI Resume Preview"
                            style={{
                                filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.08))'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Animations CSS injected inline */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(0.5deg); }
                }
                @keyframes blink {
                    from, to { border-color: transparent }
                    50% { border-color: #e52d27; }
                }
            `}</style>
        </div>
    );
}