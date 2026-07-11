import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const dot = (color) => (
    <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
      style={{ backgroundColor: color, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }} />
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans">
      {/* Header — full-bleed colored band */}
      <header className="relative px-10 pt-10 pb-8 text-white overflow-hidden"
        style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
        {/* Geometric accent shape */}
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full opacity-10 bg-white" />

        <h1 className="text-[2.6rem] font-extrabold tracking-tight leading-none mb-1">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-base font-semibold uppercase tracking-[0.22em] text-white/80 mb-6">
          {data.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/90">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="shrink-0" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="shrink-0" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={13} className="shrink-0" />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={13} className="shrink-0" />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="px-10 py-8 space-y-7">
        {/* Summary */}
        {data.professional_summary && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>
              Professional Summary
            </h2>
            <p className="text-[14px] text-gray-700 leading-[1.8] text-justify">{data.professional_summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b" style={{ color: accentColor, borderColor: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-[13px] font-semibold mb-1.5" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && (
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-white px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                      {formatDate(exp.start_date)}{" – "}{exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b" style={{ color: accentColor, borderColor: accentColor }}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.project.map((proj, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                    {proj.description && (
                      <p className="text-[13px] text-gray-600 leading-relaxed mt-1">{proj.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="text-[15px] font-bold text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: accentColor }}>{edu.institution}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{formatDate(edu.graduation_date)}{edu.gpa && ` · GPA ${edu.gpa}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[12px] font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
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
};

export default ModernTemplate;