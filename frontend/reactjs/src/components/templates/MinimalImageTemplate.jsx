import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "";
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SideLabel = ({ children }) => (
    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3.5 pb-1 border-b border-gray-200">
      {children}
    </h2>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-800 font-sans flex flex-row min-h-[1123px]">
      {/* Left Sidebar */}
      <aside
        className="w-[240px] shrink-0 flex flex-col p-7 border-r border-gray-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Profile Image Section */}
        {data.personal_info?.image_url && (
          <div className="mb-6 flex justify-center">
            <div
              className="w-28 h-28 rounded-full overflow-hidden p-1 bg-white shadow-md border"
              style={{ borderColor: accentColor }}
            >
              <img
                src={data.personal_info.image_url}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        {/* Name & Title */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mt-2" style={{ color: accentColor }}>
            {data.personal_info?.profession || "Profession"}
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <SideLabel>Contact</SideLabel>
          <div className="space-y-3 text-[12px] text-gray-600">
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2.5">
                <Phone size={12} className="shrink-0 opacity-70" style={{ color: accentColor }} />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.email && (
              <div className="flex items-center gap-2.5">
                <Mail size={12} className="shrink-0 opacity-70" style={{ color: accentColor }} />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2.5">
                <MapPin size={12} className="shrink-0 opacity-70" style={{ color: accentColor }} />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-center gap-2.5">
                <Linkedin size={12} className="shrink-0 opacity-70" style={{ color: accentColor }} />
                <span className="break-all">{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-center gap-2.5">
                <Globe size={12} className="shrink-0 opacity-70" style={{ color: accentColor }} />
                <span className="break-all">{data.personal_info.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        {data.education?.length > 0 && (
          <div className="mb-8">
            <SideLabel>Education</SideLabel>
            <div className="space-y-4 text-[12px] text-gray-700">
              {data.education.map((edu, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-bold text-gray-900 leading-snug">{edu.degree}</p>
                  {edu.field && <p className="text-gray-600 text-[11px] font-medium">{edu.field}</p>}
                  <p className="text-gray-500 italic text-[11px]">{edu.institution}</p>
                  <p className="text-gray-400 text-[10px] font-sans mt-0.5">
                    {formatDate(edu.graduation_date)}{edu.gpa && ` · GPA ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {data.skills?.length > 0 && (
          <div>
            <SideLabel>Skills</SideLabel>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2.5 py-1 rounded bg-white text-gray-700 border border-gray-200 shadow-sm"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-9 space-y-8 bg-white">
        {/* Professional Summary */}
        {data.professional_summary && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-3.5 pl-3 border-l-2" style={{ borderColor: accentColor }}>
              Professional Summary
            </h2>
            <div className="text-[13.5px] text-gray-600 leading-[1.8] text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: data.professional_summary }} />
          </section>
        )}

        {/* Experience Section */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100 pl-3 border-l-2" style={{ borderColor: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4" style={{ borderLeft: `1.5px solid ${accentColor}` }}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[14px] font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-[11px] text-gray-400 bg-gray-50 border rounded px-2.5 py-0.5 shrink-0 ml-3">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-[12.5px] font-semibold mb-2" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && (
                    <div className="text-[12.5px] text-gray-600 leading-relaxed text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.project?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100 pl-3 border-l-2" style={{ borderColor: accentColor }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.project.map((proj, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-100/80">
                  <h3 className="text-[14px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.type && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: accentColor }}>
                      {proj.type}
                    </p>
                  )}
                  {proj.description && (
                    <div className="text-[12.5px] text-gray-600 mt-2 leading-relaxed text-justify rich-text-content" dangerouslySetInnerHTML={{ __html: proj.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MinimalImageTemplate;