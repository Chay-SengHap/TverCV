import React from 'react';

const AcademicTemplate = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto p-6 sm:p-12 bg-white text-gray-900 font-serif leading-relaxed">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-normal tracking-wide text-gray-900 mb-2">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-sm italic text-gray-600 mb-4">
          {data.personal_info?.profession || "Profession"}
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-700 font-sans">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>| {data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>| {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && (
            <span className="break-all">| {data.personal_info.linkedin}</span>
          )}
          {data.personal_info?.website && (
            <span className="break-all">| {data.personal_info.website}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 font-sans pb-1 border-b" style={{ color: accentColor }}>
            Research & Summary
          </h2>
          <p className="text-xs text-gray-800 text-justify font-serif break-words">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans pb-1 border-b" style={{ color: accentColor }}>
            Employment & Appointments
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <h3>{exp.position} — <span className="font-normal italic text-gray-700">{exp.company}</span></h3>
                  <span className="font-sans font-medium text-gray-500">
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-gray-800 leading-relaxed mt-1 whitespace-pre-line text-justify font-serif break-words">
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
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans pb-1 border-b" style={{ color: accentColor }}>
            Publications & Projects
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index} className="text-xs">
                <h3 className="font-bold text-gray-900 break-words">{proj.name}</h3>
                <p className="text-gray-800 mt-0.5 leading-relaxed text-justify font-serif break-words">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans pb-1 border-b" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline text-xs">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700 italic">{edu.institution}</p>
                  {edu.gpa && <p className="text-[10px] text-gray-500 font-sans">GPA: {edu.gpa}</p>}
                </div>
                <span className="font-sans font-medium text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans pb-1 border-b" style={{ color: accentColor }}>
            Technical Expertise
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {data.skills.map((skill, index) => (
              <span key={index} className="text-gray-850">
                <strong className="font-sans text-gray-900">{skill.skill_name}</strong> ({skill.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AcademicTemplate;
