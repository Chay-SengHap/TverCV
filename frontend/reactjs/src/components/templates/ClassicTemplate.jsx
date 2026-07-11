import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SectionTitle = ({ children }) => (
    <div className="flex flex-col gap-1 mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
        {children}
      </h2>
      <div className="h-[1.5px] w-full" style={{ backgroundColor: accentColor, opacity: 0.25 }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 font-sans min-h-[1123px]" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <header className="px-12 pt-10 pb-6 text-center border-b-[3px]" style={{ borderColor: accentColor }}>
        <h1 className="text-[2.6rem] font-bold tracking-tight text-gray-900 mb-1 uppercase"
          style={{ letterSpacing: "0.08em", fontFamily: "'Georgia', serif" }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-[12px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: accentColor }}>
          {data.personal_info?.profession || "Profession"}
        </p>

        {/* Contacts aligned horizontally with custom separators */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[12.5px] text-gray-500 font-sans">
          {data.personal_info?.email && (
            <span className="flex items-center gap-1">
              {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                {data.personal_info.phone}
              </span>
            </>
          )}
          {data.personal_info?.location && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                {data.personal_info.location}
              </span>
            </>
          )}
          {data.personal_info?.linkedin && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 break-all">
                {data.personal_info.linkedin}
              </span>
            </>
          )}
          {data.personal_info?.website && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 break-all">
                {data.personal_info.website}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="px-12 py-8 space-y-7">
        {/* Professional Summary */}
        {data.professional_summary && (
          <section>
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-[13.5px] text-gray-700 leading-[1.8] text-justify">{data.professional_summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="pl-4 border-l-[1.5px]" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-[13px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <span className="text-[12px] text-gray-500 font-medium font-sans shrink-0 ml-4 mt-0.5">
                      {formatDate(exp.start_date)}{formatDate(exp.start_date) && " – "}{exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-[13.5px] text-gray-600 leading-relaxed mt-2 whitespace-pre-line text-justify">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <section>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {data.project.map((proj, i) => (
                <div key={i} className="pl-4 border-l-[1.5px]" style={{ borderColor: accentColor }}>
                  <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.description && (
                    <p className="text-[13.5px] text-gray-600 leading-relaxed mt-1.5 text-justify">{proj.description}</p>
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
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="pl-4 border-l-[1.5px]" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-[13px] text-gray-600 mt-0.5">{edu.institution}</p>
                      {edu.gpa && <p className="text-[12px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[12px] text-gray-500 font-sans shrink-0 ml-4">{formatDate(edu.graduation_date)}</span>
                  </div>
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
                  className="text-[12px] px-3.5 py-1 rounded-full border font-sans text-gray-700 bg-gray-50"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  {skill.skill_name}
                  {skill.proficiency && <span className="opacity-60 ml-1.5 font-light">({skill.proficiency})</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;