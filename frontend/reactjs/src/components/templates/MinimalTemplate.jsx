
const MinimalTemplate = ({ data, accentColor }) => {
    if (!data) return null;

    const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr.includes("undefined")) return "Date Not Set";
    if (!dateStr.includes("-")) return dateStr;
    
    const [year, month] = dateStr.split("-");
    if (!year || !month || isNaN(year) || isNaN(month)) return "Date Not Set";

    return new Date(year, month - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short"
    });
};

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-12 bg-white text-gray-900 font-light font-sans">
            {/* Header */}
            <header className="mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-4xl font-thin mb-2 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p className="text-sm font-light text-gray-500 tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                    {data.personal_info?.profession || "Profession"}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>• {data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>• {data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">• {data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">• {data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-8">
                    <p className="text-sm text-gray-700 leading-relaxed text-justify break-words">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-semibold text-gray-800 break-words">{exp.position}</h3>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2 font-medium break-words">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line text-justify break-words">
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
                    <h2 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <h3 className="text-sm font-semibold text-gray-800 break-words">{proj.name}</h3>
                                <p className="text-xs text-gray-700 leading-relaxed break-words">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-xs text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span 
                                key={index} 
                                className="text-xs px-3 py-1 bg-gray-50 border border-gray-100 rounded text-gray-700 font-medium"
                                style={{ 
                                    WebkitPrintColorAdjust: "exact",
                                    printColorAdjust: "exact"
                                }}
                            >
                                {skill.skill_name} <span className="text-gray-400">({skill.proficiency})</span>
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;