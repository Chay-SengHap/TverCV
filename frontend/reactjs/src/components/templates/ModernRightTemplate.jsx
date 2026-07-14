import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernRightTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SideLabel = ({ children }) => (
    <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: accentColor }}>{children}</h2>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-900 font-sans flex flex-row min-h-[1050px]">
      {/* Left — Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-[2.5rem] font-extrabold tracking-tight text-gray-900 mb-1 leading-none">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: accentColor }}>
            {data.personal_info?.profession || "Profession"}
          </p>
        </header>

        {/* Summary */}
        {data.professional_summary && (
          <section className="mb-7">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>
              About Me
            </h2>
            <div className="text-[14px] text-gray-700 leading-[1.8] text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: data.professional_summary }} />
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="pl-4" style={{ borderLeft: `2.5px solid ${accentColor}` }}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded px-2.5 py-0.5 shrink-0 ml-3">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-gray-500 mb-1.5">{exp.company}</p>
                  {exp.description && (
                    <div className="text-[13px] text-gray-700 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100" style={{ color: accentColor }}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.project.map((proj, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.description && (
                    <div className="text-[13px] text-gray-600 mt-1 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: proj.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Right Sidebar */}
      <aside
        className="w-[210px] shrink-0 p-8 border-l border-gray-100"
        style={{ backgroundColor: "#fafafa" }}
      >
        {/* Contact */}
        <div className="mb-7">
          <SideLabel>Contact</SideLabel>
          <div className="space-y-2.5 text-[13px] text-gray-600">
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <Mail size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.phone && (
              <div className="flex items-start gap-2">
                <Phone size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-start gap-2">
                <MapPin size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-start gap-2">
                <Linkedin size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                <span className="break-all">{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-2">
                <Globe size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {data.education?.length > 0 && (
          <div className="mb-7 pt-5 border-t border-gray-200">
            <SideLabel>Education</SideLabel>
            <div className="space-y-4 text-[13px]">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900 leading-snug">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-gray-500">{edu.institution}</p>
                  <p className="text-gray-400 mt-0.5 text-[11px]">
                    {formatDate(edu.graduation_date)}{edu.gpa && ` · GPA ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div className="pt-5 border-t border-gray-200">
            <SideLabel>Skills</SideLabel>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ModernRightTemplate;
