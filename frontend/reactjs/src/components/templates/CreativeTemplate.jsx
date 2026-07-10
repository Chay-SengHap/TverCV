import React from 'react';

const CreativeTemplate = ({ data, accentColor }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-900 font-sans flex flex-col md:flex-row print:flex-row min-h-[1000px] border border-gray-100">
      {/* Sidebar (Left Column) */}
      <div className="w-full md:w-1/3 print:w-1/3 bg-gray-900 text-white p-6 md:p-8 print:p-8 flex flex-col justify-between" style={{ borderLeft: `6px solid ${accentColor}` }}>
        <div>
          {/* Header Contact */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 break-words">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
              {data.personal_info?.profession || "Profession"}
            </p>
          </div>

          <div className="space-y-4 text-xs text-gray-300">
            <h2 className="text-xs uppercase tracking-widest font-bold border-b border-gray-700 pb-1 mb-2">
              Contact
            </h2>
            {data.personal_info?.email && (
              <div>
                <p className="font-semibold text-gray-400">Email</p>
                <p className="break-all">{data.personal_info.email}</p>
              </div>
            )}
            {data.personal_info?.phone && (
              <div>
                <p className="font-semibold text-gray-400">Phone</p>
                <p>{data.personal_info.phone}</p>
              </div>
            )}
            {data.personal_info?.location && (
              <div>
                <p className="font-semibold text-gray-400">Location</p>
                <p>{data.personal_info.location}</p>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div>
                <p className="font-semibold text-gray-400">LinkedIn</p>
                <p className="break-all">{data.personal_info.linkedin}</p>
              </div>
            )}
            {data.personal_info?.website && (
              <div>
                <p className="font-semibold text-gray-400">Website</p>
                <p className="break-all">{data.personal_info.website}</p>
              </div>
            )}
          </div>

          {/* Skills Badges */}
          {data.skills && data.skills.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-widest font-bold border-b border-gray-700 pb-1 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-semibold px-2 py-1 rounded text-white"
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

        <div className="text-[10px] text-gray-500 mt-8">
          Generated via TverCV
        </div>
      </div>

      {/* Main Content (Right Column) */}
      <div className="w-full md:w-2/3 print:w-2/3 p-6 md:p-8 print:p-8">
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
                <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: "#f3f4f6" }}>
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-1 border-b" style={{ borderColor: accentColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
