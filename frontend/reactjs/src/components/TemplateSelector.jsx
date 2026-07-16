import { Check, Layout, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ResumePreview from './ResumePreview';

const dummyResumeData = {
  personal_info: {
    full_name: "Roth Sorayuth",
    profession: "Lead Full-Stack Software Engineer",
    email: "rayuth@gmail.com",
    phone: "0123456789",
    location: "Phnom Penh, Cambodia",
    linkedin: "linkedin.com/in/yuth-tech",
    website: "rayuth.dev",
    image_url: "https://ik.imagekit.io/3txkyljof/user-resume/resume-undefined.jpg?updatedAt=1783959324546"
  },
  professional_summary: "Results-driven Lead Full-Stack Software Engineer with over 6 years of experience designing, building, and deploying robust web applications. Proven track record of optimizing application performance, leading cross-functional developer teams, and implementing scalable cloud architectures. Passionate about writing clean, maintainable code and solving complex technical challenges.",
  experience: [
    {
      position: "Lead Full-Stack Developer",
      company: "InnovateTech Solutions",
      start_date: "2023-03",
      end_date: "",
      is_current: true,
      description: "• Architected and launched a micro-frontend platform, improving page load speeds by 40%.\n• Manage and mentor a team of 6 engineers, organizing agile sprints and performing daily code reviews.\n• Implemented secure JWT-based auth systems and automated CI/CD deployment pipelines on AWS."
    }
  ],
  education: [
    { 
      degree: "M.S.", 
      field: "Software Engineering", 
      institution: "Stanford University", 
      graduation_date: "2020-05" 
    }
  ],
  project: [
    { 
      name: "AI-Powered CV Platform", 
      description: "Developed a full-stack resume builder integrating generative AI models to analyze, parse, and suggest structural optimization tips for uploaded PDF documents." 
    }
  ],
  skills: [
    "JavaScript (ES6+)", "React & Redux", "Node.js", "PostgreSQL", "Git & CI/CD"
  ]
};

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const templates = [
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern Side" },
    { id: "minimal-image", name: "Minimal Image" },
    { id: "minimal", name: "Minimal" },
    { id: "executive", name: "Executive" },
    { id: "creative", name: "Creative" },
    { id: "modern-right", name: "Modern Right" },
    { id: "academic", name: "Academic/CV" }
  ];

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-1.5 text-xs text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg font-semibold'
      >
        <Layout size={14} />
        <span>Template</span>
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-3xl p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">Select a Template</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose a design layout for your resume.</p>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    onChange(tpl.id);
                    setIsOpen(false);
                  }}
                  className={`group relative p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-56 ${
                    selectedTemplate === tpl.id
                      ? 'border-blue-500 bg-blue-50/20 shadow-md ring-2 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow bg-white'
                  }`}
                >
                  {/* Live Template Preview Area */}
                  <div className="w-full h-40 rounded-lg shadow-sm overflow-hidden flex items-start justify-center bg-slate-50 border border-slate-100 relative group/preview">
                    <div className="w-full h-full pointer-events-none">
                      <ResumePreview
                        data={dummyResumeData}
                        template={tpl.id}
                        accentColor="#3B82F6"
                        mode="thumbnail"
                      />
                    </div>
                  </div>

                  {/* Template Label */}
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 truncate mr-1">{tpl.name}</span>
                    {selectedTemplate === tpl.id && (
                      <span className="size-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;