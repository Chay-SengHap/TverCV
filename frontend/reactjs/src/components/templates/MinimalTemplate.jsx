import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SectionTitle = ({ children }) => (
    <div className="flex flex-col gap-1 mb-3.5">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.25em]" style={{ color: accentColor }}>
        {children}
      </h2>
      <div className="h-[2px] w-8 rounded" style={{ backgroundColor: accentColor }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-10 py-8 bg-white text-gray-900 font-sans min-h-[1123px]">
      {/* Header — left-aligned, ultra-clean */}
      <header className="mb-6 border-b border-gray-100 pb-5">
        <h1 className="text-[2.8rem] font-light tracking-tight text-gray-900 mb-2 leading-none">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-[13px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: accentColor }}>
          {data.personal_info?.profession || "Profession"}
        </p>

        {/* Contacts with light icons */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-gray-500">
          {data.personal_info?.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={12} style={{ color: accentColor }} className="opacity-70" />
              {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={12} style={{ color: accentColor }} className="opacity-70" />
              {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} style={{ color: accentColor }} className="opacity-70" />
              {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <span className="flex items-center gap-1.5 break-all">
              <Linkedin size={12} style={{ color: accentColor }} className="opacity-70" />
              {data.personal_info.linkedin}
            </span>
          )}
          {data.personal_info?.website && (
            <span className="flex items-center gap-1.5 break-all">
              <Globe size={12} style={{ color: accentColor }} className="opacity-70" />
              {data.personal_info.website}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {data.professional_summary && (
          <section className="text-justify">
            <p className="text-[14px] text-gray-600 leading-[1.8] font-light">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-6 items-start">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-[13px] font-medium mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                    {exp.description && (
                      <p className="text-[13.5px] text-gray-600 leading-relaxed mt-2 whitespace-pre-line text-justify">{exp.description}</p>
                    )}
                  </div>
                  <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap mt-1">
                    {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <section>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-3.5">
              {data.project.map((proj, i) => (
                <div key={i} className="border-l border-gray-200 pl-4 py-0.5">
                  <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.description && (
                    <p className="text-[13.5px] text-gray-600 leading-relaxed mt-2 text-justify">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-0.5">{edu.institution}</p>
                    {edu.gpa && <p className="text-[12px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[12px] text-gray-400 shrink-0 ml-4 font-medium">{formatDate(edu.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section>
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[12px] px-3 py-1 rounded border border-gray-200 text-gray-700 bg-gray-50 font-medium"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;