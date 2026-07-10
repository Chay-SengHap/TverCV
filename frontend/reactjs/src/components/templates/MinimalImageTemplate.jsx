import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-white text-zinc-800 border border-zinc-100 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3">
        {/* Profile Image & Header Left */}
        <div className="col-span-1 py-10 flex items-center justify-center border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-zinc-100 bg-zinc-50/50">
          {data.personal_info?.image_url && typeof data.personal_info.image_url === 'string' ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4" style={{ borderColor: accentColor }}>
              <img src={data.personal_info.image_url} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : null}
        </div>

        {/* Profile Name & Header Right */}
        <div className="col-span-1 md:col-span-2 print:col-span-2 flex flex-col justify-center py-6 md:py-10 print:py-10 px-6 md:px-8 print:px-8">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="uppercase font-semibold text-xs tracking-widest" style={{ color: accentColor }}>
            {data?.personal_info?.profession || "Profession"}
          </p>
        </div>

        {/* Sidebar (Left Column) */}
        <aside className="col-span-1 border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-zinc-100 p-6 md:p-8 print:p-8 md:pt-6 print:pt-6 bg-zinc-50/50 md:min-h-[800px] print:min-h-[800px]">
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 mb-4 uppercase">
              Contact
            </h2>
            <div className="space-y-3 text-xs">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span className="break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span className="break-all">{data.personal_info.linkedin}</span>
                </div>
              )}
              {data.personal_info?.website && (
                <div className="flex items-center gap-2">
                  <Globe size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span className="break-all">{data.personal_info.website}</span>
                </div>
              )}
            </div>
          </section>

          {data.education && data.education.length > 0 && (
            <section className="mb-8 border-t border-zinc-100 pt-6">
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 mb-4 uppercase">
                Education
              </h2>
              <div className="space-y-4 text-xs">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-bold text-zinc-800">{edu.degree}</p>
                    <p className="text-zinc-650 italic">{edu.institution}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section className="border-t border-zinc-100 pt-6">
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 mb-4 uppercase">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-[10px] font-semibold px-2 py-0.5 rounded text-white"
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
        </aside>

        {/* Main Content (Right Column) */}
        <main className="col-span-1 md:col-span-2 print:col-span-2 p-6 md:p-8 print:p-8 md:pt-6 print:pt-6">
          {data.professional_summary && (
            <section className="mb-8">
              <h2 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: accentColor }} >
                Summary
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                {data.professional_summary}
              </p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: accentColor }} >
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: "#f3f4f6" }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-zinc-900">
                        {exp.position}
                      </h3>
                      <span className="text-xs font-semibold text-zinc-400">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold mb-2" style={{ color: accentColor }} >
                      {exp.company}
                    </p>
                    {exp.description && (
                      <div className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line text-justify">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.project && data.project.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: accentColor }}>
                Projects
              </h2>
              <div className="space-y-4">
                {data.project.map((project, index) => (
                  <div key={index} className="bg-zinc-50 p-3 rounded">
                    <h3 className="text-sm font-bold text-zinc-900">{project.name}</h3>
                    {project.type && (
                      <p className="text-[10px] font-semibold uppercase mt-0.5" style={{ color: accentColor }} >
                        {project.type}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-xs text-zinc-750 mt-1 leading-relaxed text-justify">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default MinimalImageTemplate;