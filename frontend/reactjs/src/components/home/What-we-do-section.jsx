import { Key, FileEdit, Download } from "lucide-react";

export default function WhatWeDoSection() {
    const features = [
        {
            title: "AI PDF Resume Import",
            desc: "Upload your existing PDF resume and let our AI instantly parse the text to pre-fill your profile sections.",
            icon: Key,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-100",
        },
        {
            title: "Real-Time Template Customizer",
            desc: "Toggle between Classic, Minimal, or Modern styles and pick custom accent colors with live updates.",
            icon: FileEdit,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            borderColor: "border-emerald-100",
        },
        {
            title: "Comprehensive Section Builder",
            desc: "Quickly manage organized inputs for Professional Summaries, Experiences, Educations, Projects, and Skills.",
            icon: Download,
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
            borderColor: "border-orange-100",
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 min-h-[85vh] flex flex-col justify-center">
            {/* Header */}
            <div className="text-center space-y-3 mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Build Your CV
                </h2>
                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                    Create, edit and download professional resumes with TverCV
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left side Image */}
                <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl hover:scale-[1.01] transition-transform duration-300">
                        <img 
                            className="w-full max-h-[50vh] object-contain bg-slate-50"
                            src="/assets/job.png"
                            alt="SpongeBob building CV" 
                        />
                    </div>
                </div>

                {/* Right side Features list */}
                <div className="lg:col-span-7 space-y-4">
                    {features.map((feat, index) => {
                        const IconComponent = feat.icon;
                        return (
                            <div 
                                key={index} 
                                className={`flex items-start gap-4 p-4 rounded-2xl border ${feat.borderColor} ${feat.bgColor} transition-all duration-300 hover:shadow-md`}
                            >
                                <div className={`p-3 rounded-xl bg-white shadow-sm shrink-0`}>
                                    <IconComponent className={`size-5 sm:size-6 ${feat.iconColor}`} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm sm:text-base font-bold text-gray-800">
                                        {feat.title}
                                    </h4>
                                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                        {feat.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}