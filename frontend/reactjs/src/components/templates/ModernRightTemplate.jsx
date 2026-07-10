import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernRightTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short"
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-900 font-sans flex flex-col md:flex-row print:flex-row min-h-[1000px] border border-gray-200">
      {/* Left Column (Main Content) */}
      <div className="w-full md:w-2/3 print:w-2/3 p-6 md:p-8 print:p-8 md:pr-6 print:pr-6">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-lg font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
            {data.personal_info?.profession || "Profession"}
          </p>
        </header>

        {/* Professional Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b" style={{ borderColor: accentColor }}>
              About Me
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed break-words">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ borderColor: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold text-gray-800 break-words">{exp.position}</h3>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2 break-words">{exp.company}</p>
                  {exp.description && (
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line break-words">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project && data.project.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ borderColor: accentColor }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.project.map((proj, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-bold text-gray-800 break-words">{proj.name}</h3>
                  <p className="text-xs text-gray-600 mt-1 break-words">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full md:w-1/3 print:w-1/3 bg-gray-50 p-6 md:p-8 print:p-8 md:pl-6 print:pl-6 border-t md:border-t-0 print:border-t-0 md:border-l print:border-l border-gray-200">
        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest font-bold border-b border-gray-300 pb-1 mb-4 text-gray-700">
            Contact
          </h2>
          <div className="space-y-3 text-xs text-gray-600">
            {data.personal_info?.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-gray-500" />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-gray-500" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-gray-500" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="size-4 shrink-0 text-gray-500" />
                <span className="break-all">{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center gap-2">
                <Globe className="size-4 shrink-0 text-gray-500" />
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest font-bold border-b border-gray-300 pb-1 mb-4 text-gray-700">
              Education
            </h2>
            <div className="space-y-4 text-xs">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-400 mt-0.5">{formatDate(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold border-b border-gray-300 pb-1 mb-4 text-gray-700">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] font-medium px-2 py-0.5 rounded text-white"
                  style={{
                    backgroundColor: accentColor,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact"
                  }}
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernRightTemplate;
