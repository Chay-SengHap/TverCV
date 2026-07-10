import React from 'react';

const ExecutiveTemplate = ({ data, accentColor }) => {
  if (!data) return null;

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
    <div className="max-w-4xl mx-auto p-6 sm:p-12 bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase mb-2">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-lg font-medium tracking-wide uppercase mb-4" style={{ color: accentColor }}>
          {data.personal_info?.profession || "Profession"}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>• {data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>• {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && (
            <span className="break-all">• {data.personal_info.linkedin}</span>
          )}
          {data.personal_info?.website && (
            <span className="break-all">• {data.personal_info.website}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <h2 className="text-md uppercase tracking-wider font-semibold border-b mb-3 pb-1" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify break-words">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-md uppercase tracking-wider font-semibold border-b mb-4 pb-1" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-800 break-words">{exp.position}</h3>
                  <span className="text-sm font-medium text-gray-500">
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="flex justify-between text-sm italic text-gray-600 mb-2">
                  <span className="break-words">{exp.company}</span>
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
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
          <h2 className="text-md uppercase tracking-wider font-semibold border-b mb-4 pb-1" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Key Projects
          </h2>
          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index} className="space-y-1">
                <h3 className="text-base font-bold text-gray-800 break-words">{proj.name}</h3>
                <p className="text-sm text-gray-700 leading-relaxed break-words">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-md uppercase tracking-wider font-semibold border-b mb-4 pb-1" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-md uppercase tracking-wider font-semibold border-b mb-4 pb-1" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Expertise & Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span 
                key={index} 
                className="text-xs border px-3 py-1 rounded bg-gray-50 text-gray-800"
                style={{ 
                  borderColor: "#d1d5db",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact"
                }}
              >
                {skill.skill_name} <span className="text-gray-400">({skill.proficiency})</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
