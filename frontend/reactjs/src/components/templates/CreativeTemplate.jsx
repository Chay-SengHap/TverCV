import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const CreativeTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SideSection = ({ title, children }) => (
    <div className="mb-7">
      <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 mb-3">{title}</h2>
      {children}
    </div>
  );

  const MainSection = ({ title, children }) => (
    <section className="mb-7">
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 pb-2"
        style={{ color: accentColor, borderBottom: `1.5px solid ${accentColor}` }}
      >
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white font-sans flex flex-row min-h-[1050px]">
      {/* Dark Sidebar */}
      <aside
        className="w-[230px] shrink-0 text-white p-8 flex flex-col"
        style={{
          backgroundColor: "#1a1a2e",
          borderTop: `5px solid ${accentColor}`,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact"
        }}
      >
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight mb-1">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: accentColor }}>
            {data.personal_info?.profession || "Profession"}
          </p>
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          <div className="space-y-2.5 text-[13px] text-white/75">
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
        </SideSection>

        {/* Skills */}
        {data.skills?.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    color: "#fff",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact"
                  }}
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </SideSection>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <SideSection title="Education">
            <div className="space-y-3 text-[13px] text-white/75">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="font-bold text-white leading-snug">{edu.degree}</p>
                  {edu.field && <p className="text-white/60 text-[12px]">{edu.field}</p>}
                  <p className="italic text-[12px] text-white/50">{edu.institution}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {formatDate(edu.graduation_date)}{edu.gpa && ` · GPA ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </SideSection>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        {/* Summary */}
        {data.professional_summary && (
          <MainSection title="About Me">
            <div className="text-[14px] text-gray-700 leading-[1.8] text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: data.professional_summary }} />
          </MainSection>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <MainSection title="Experience">
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ml-3"
                      style={{ backgroundColor: accentColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                    >
                      {formatDate(exp.start_date)} — {exp.is_current ? "Now" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-gray-500 mb-2">{exp.company}</p>
                  {exp.description && (
                    <div className="text-[13px] text-gray-700 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {/* Projects */}
        {data.project?.length > 0 && (
          <MainSection title="Projects">
            <div className="space-y-3">
              {data.project.map((proj, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border-l-4"
                  style={{ borderColor: accentColor, backgroundColor: "#f9f9fb" }}
                >
                  <h3 className="text-[15px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.description && (
                    <div className="text-[13px] text-gray-600 mt-1 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: proj.description }} />
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </main>
    </div>
  );
};

export default CreativeTemplate;
