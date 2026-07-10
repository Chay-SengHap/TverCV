import { ArrowRightIcon, Infinity, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import heroImg from "../../../public/assets/hero_white_bg.png";

export default function HeroSection() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white py-12 sm:py-20 lg:py-24">
            {/* Background decorative glow elements */}
            <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-red-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-6 sm:space-y-8 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
                    
                    {/* Premium Tag Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 px-4 py-1.5 rounded-full text-red-600 text-xs sm:text-sm font-semibold tracking-wide">
                        <Sparkles className="size-4 animate-bounce" />
                        <span>The Next Generation CV Builder</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                        Land your dream job with{" "}
                        <span className="bg-gradient-to-r from-[#e52d27] via-[#d9383a] to-[#b31217] bg-clip-text text-transparent">
                            AI-powered
                        </span>{" "}
                        resumes.
                    </h1>
                    
                    <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                        Create, edit and download professional resumes with TverCV
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2 justify-center lg:justify-start">
                        <button className="flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-red-500/80 text-red-600 font-bold hover:bg-red-50/50 active:scale-95 transition-all duration-200 cursor-pointer text-sm">
                            Demo
                        </button>
                        
                        {!user ? (
                            <Link 
                                to="/app?state=register" 
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] text-white font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-sm"
                            >
                                Get Start <ArrowRightIcon className="size-4" />
                            </Link>
                        ) : (
                            <Link 
                                to="/app" 
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] text-white font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-sm"
                            >
                                Dashboard <ArrowRightIcon className="size-4" />
                            </Link>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-gray-200/80 w-full max-w-lg">
                        <div className="space-y-1">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">12.5K</h3>
                            <p className="text-gray-500 text-xs sm:text-sm font-medium">Careers Accelerated</p>
                        </div>
                        <div className="space-y-1 border-l border-gray-200 pl-4 sm:pl-6">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">4</h3>
                            <p className="text-gray-500 text-xs sm:text-sm font-medium">Free Templates</p>
                        </div>
                        <div className="space-y-1 border-l border-gray-200 pl-4 sm:pl-6">
                            <div className="flex items-center justify-center lg:justify-start gap-1 h-8 sm:h-9">
                                <Infinity className="size-7 sm:size-8 text-gray-900" />
                            </div>
                            <p className="text-gray-500 text-xs sm:text-sm font-medium">Infinity CV build</p>
                        </div>
                    </div>
                </div>

                {/* Right Image Column */}
                <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none px-4 sm:px-0">
                        {/* Soft visual floating background effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-blue-500/5 rounded-3xl blur-2xl -z-10"></div>
                        <img 
                            className="w-full h-auto drop-shadow-2xl rounded-2xl transform hover:scale-[1.03] transition-all duration-500 animate-[float_6s_ease-in-out_infinite]" 
                            src={heroImg} 
                            alt="Clean AI Resume Preview" 
                            style={{
                                filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.08))'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Float animation CSS injected inline */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(0.5deg); }
                }
            `}</style>
        </div>
    );
}