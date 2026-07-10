import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
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
    <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans border border-gray-100">
      {/* Header */}
      <header className="p-10 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest mb-6 text-white/90">
          {data.personal_info?.profession || "Profession"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a target="_blank" rel="noopener noreferrer" href={data.personal_info?.linkedin} className="flex items-center gap-2 hover:underline">
              <Linkedin className="size-4 shrink-0" />
              <span className="break-all">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
            </a>
          )}
          {data.personal_info?.website && (
            <a target="_blank" rel="noopener noreferrer" href={data.personal_info?.website} className="flex items-center gap-2 hover:underline">
              <Globe className="size-4 shrink-0" />
              <span className="break-all">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
            </a>
          )}
        </div>
      </header>

      <div className="p-10">
        {/* Professional Summary */}
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.professional_summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-wider font-bold mb-6 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
              Experience
            </h2>

            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: "#f3f4f6" }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-xs text-gray-750 leading-relaxed mt-2 whitespace-pre-line text-justify">
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
            <h2 className="text-sm uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
              Projects
            </h2>

            <div className="space-y-4">
              {data.project.map((p, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-gray-700 leading-relaxed text-justify">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
                Education
              </h2>

              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="text-xs">
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="font-semibold mt-0.5" style={{ color: accentColor }}>{edu.institution}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mt-1">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm uppercase tracking-wider font-bold mb-4 pb-1 border-b" style={{ color: accentColor, borderColor: "#e5e7eb" }}>
                Skills
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs text-white rounded font-medium"
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModernTemplate;