import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto p-6 sm:p-12 bg-white text-gray-900 leading-relaxed font-sans">
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 uppercase">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: accentColor }}>
          {data.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600 font-medium">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="size-3.5" style={{ color: accentColor }} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5" style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5" style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="size-3.5" style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="size-3.5" style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider font-bold mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-justify break-words">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Experience
          </h2>

          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index} className="pl-4 border-l-2" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 break-words">{exp.position}</h3>
                    <p className="text-xs font-semibold text-gray-600 break-words">{exp.company}</p>
                  </div>
                  <div className="text-right text-xs font-semibold text-gray-500">
                    <span>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line mt-1 break-words">
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
          <h2 className="text-xs uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Projects
          </h2>

          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index} className="pl-4 border-l-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 break-words">{proj.name}</h3>
                <p className="text-xs text-gray-700 leading-relaxed mt-1 break-words">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Education
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  <span>{formatDate(edu.graduation_date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
            Skills
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
}

export default ClassicTemplate;