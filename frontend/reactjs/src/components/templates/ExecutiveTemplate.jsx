import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ExecutiveTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const Rule = () => (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );

  const SectionTitle = ({ children }) => (
    <div className="text-center mb-5">
      <Rule />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accentColor }}>
        {children}
      </h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-12 py-10 bg-white text-gray-900 font-sans">
      {/* Header — centered, regal */}
      <header className="text-center mb-10">
        <h1
          className="text-[2.8rem] font-bold uppercase tracking-[0.12em] text-gray-900 mb-1 leading-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-sm font-medium tracking-[0.22em] uppercase mb-5" style={{ color: accentColor }}>
          {data.personal_info?.profession || "Profession"}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-16 h-px bg-gray-300" />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }} />
          <div className="w-16 h-px bg-gray-300" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[13px] text-gray-500 font-sans">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={12} style={{ color: accentColor }} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={12} style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={12} style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {data.professional_summary && (
          <section>
            <SectionTitle>Executive Summary</SectionTitle>
            <p className="text-[14px] text-gray-700 leading-[1.8] text-justify">{data.professional_summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <SectionTitle>Professional Experience</SectionTitle>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-[12px] font-medium text-gray-500">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-[13px] italic text-gray-500 mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <section>
            <SectionTitle>Key Projects</SectionTitle>
            <div className="space-y-4">
              {data.project.map((proj, i) => (
                <div key={i}>
                  <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.description && (
                    <p className="text-[13px] text-gray-700 leading-relaxed mt-1">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {/* Education */}
          {data.education?.length > 0 && (
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="text-[15px] font-bold text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-[13px] italic text-gray-500">{edu.institution}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {formatDate(edu.graduation_date)}{edu.gpa && ` · GPA ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <section>
              <SectionTitle>Expertise & Skills</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[12px] font-medium px-3 py-1 rounded border"
                    style={{
                      borderColor: accentColor,
                      color: accentColor,
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
};

export default ExecutiveTemplate;
