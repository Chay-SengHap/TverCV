import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const AcademicTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SectionTitle = ({ children }) => (
    <h2
      className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4 pb-1.5 border-b font-sans"
      style={{ color: accentColor, borderColor: accentColor, opacity: 1 }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="max-w-4xl mx-auto px-12 py-10 bg-white text-gray-900"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-[2.4rem] font-normal tracking-wide text-gray-900 mb-1">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-sm italic text-gray-500 mb-4">
          {data.personal_info?.profession || "Profession"}
        </p>

        <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: accentColor }} />

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[11px] text-gray-500 font-sans">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={11} style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={11} style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-7">
        {/* Summary */}
        {data.professional_summary && (
          <section>
            <SectionTitle>Research Interest & Summary</SectionTitle>
            <div className="text-[14px] text-gray-800 leading-[1.8] text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: data.professional_summary }} />
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 font-sans">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-[13px] italic text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-[12px] text-gray-400 font-sans">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[12px] font-medium text-gray-500 shrink-0 ml-6 mt-0.5 font-sans">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <SectionTitle>Employment & Appointments</SectionTitle>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[15px] font-bold text-gray-900 font-sans">
                      {exp.position}{" "}
                      <span className="font-normal italic text-gray-600">— {exp.company}</span>
                    </h3>
                    <span className="text-[12px] font-medium text-gray-500 shrink-0 ml-6 font-sans">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-[13px] text-gray-700 leading-[1.8] mt-1.5 text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Publications */}
        {data.project?.length > 0 && (
          <section>
            <SectionTitle>Publications & Projects</SectionTitle>
            <div className="space-y-4">
              {data.project.map((proj, i) => (
                <div key={i}>
                  <h3 className="text-[15px] font-bold text-gray-900 font-sans">{proj.name}</h3>
                  {proj.description && (
                    <div className="text-[13px] text-gray-700 leading-[1.8] mt-1 text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: proj.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section>
            <SectionTitle>Technical Expertise</SectionTitle>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[13px] text-gray-800">
                  <strong className="font-sans font-semibold text-gray-900">{skill.skill_name}</strong>
                  {skill.proficiency && <span className="text-gray-400 font-sans text-[11px] ml-1">({skill.proficiency})</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AcademicTemplate;
