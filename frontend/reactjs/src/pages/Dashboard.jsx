import { FilePenLine, LoaderCircle, Pencil, Plus, Trash2, UploadCloud, X, FileText, Calendar, Search, SlidersHorizontal, Eye, Lock, Globe, Sparkles, Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';
import { useRef } from 'react';

const LazyResumePreview = ({ resume }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-28 h-36 bg-white overflow-hidden rounded border border-slate-200/50 shadow-sm flex items-start justify-center transition-transform group-hover:scale-[1.03] duration-300 relative"
    >
      {isVisible ? (
        <ResumePreview
          data={{
            personal_info: resume.personal_info || {},
            professional_summary: resume.professional_summary || "",
            experience: (resume.experiences || []).slice(0, 2),
            education: (resume.education || []).slice(0, 2),
            project: (resume.projects || []).slice(0, 2),
            skills: (resume.skills || []).slice(0, 6),
          }}
          template={resume.template}
          accentColor={resume.accent_color}
          mode="thumbnail"
        />
      ) : (
        <div className="w-full h-full p-2 flex flex-col gap-1.5 animate-pulse bg-slate-50/20">
          <div className="h-1 bg-slate-100 rounded-sm w-full" />
          <div className="flex gap-1 items-center mt-1">
            <div className="size-4.5 rounded-full bg-slate-100" />
            <div className="flex flex-col gap-0.5 w-full">
              <div className="h-1 bg-slate-100 rounded-sm w-3/4" />
              <div className="h-0.5 bg-slate-50/50 rounded-sm w-1/2" />
            </div>
          </div>
          <div className="h-[0.5px] bg-slate-100/50 w-full my-1" />
          <div className="flex flex-col gap-1">
            <div className="h-1 bg-slate-100 rounded-sm w-1/3" />
            <div className="h-0.5 bg-slate-50/50 rounded-sm w-full" />
            <div className="h-0.5 bg-slate-50/50 rounded-sm w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
};

const dummyResumeData = {
  personal_info: {
    full_name: "Roth Sorayuth",
    title: "Lead Full-Stack Software Engineer",
    email: "rayuth@gmail.com",
    phone: "0123456789",
    location: "Phnom Penh, Cambodia",
    linkedin: "linkedin.com/in/yuth-tech",
    website: "rayuth.dev",
    image_url: "https://ik.imagekit.io/3txkyljof/user-resume/resume-undefined.jpg?updatedAt=1783959324546"
  },
  professional_summary: "Results-driven Lead Full-Stack Software Engineer with over 6 years of experience designing, building, and deploying robust web applications. Proven track record of optimizing application performance, leading cross-functional developer teams, and implementing scalable cloud architectures. Passionate about writing clean, maintainable code and solving complex technical challenges.",
  experience: [
    { 
      position: "Lead Full-Stack Developer", 
      company: "InnovateTech Solutions", 
      start_date: "2023-03", 
      end_date: "", 
      is_current: true, 
      description: "• Architected and launched a micro-frontend platform, improving page load speeds by 40%.\n• Manage and mentor a team of 6 engineers, organizing agile sprints and performing daily code reviews.\n• Implemented secure JWT-based auth systems and automated CI/CD deployment pipelines on AWS." 
    },
    { 
      position: "Senior Software Engineer", 
      company: "Global Web Dynamics", 
      start_date: "2020-06", 
      end_date: "2023-02", 
      is_current: false, 
      description: "• Re-engineered database structures using PostgreSQL, decreasing query response times by 35%.\n• Developed reusable responsive UI component libraries using React and Tailwind CSS.\n• Collaborated closely with product managers to deliver weekly updates and hotfixes." 
    }
  ],
  education: [
    { 
      degree: "M.S.", 
      field: "Software Engineering", 
      institution: "Stanford University", 
      graduation_date: "2020-05" 
    },
    { 
      degree: "B.S.", 
      field: "Computer Science", 
      institution: "University of California, Berkeley", 
      graduation_date: "2018-05" 
    }
  ],
  project: [
    { 
      name: "AI-Powered CV Platform", 
      description: "Developed a full-stack resume builder integrating generative AI models to analyze, parse, and suggest structural optimization tips for uploaded PDF documents." 
    },
    { 
      name: "Enterprise Task System", 
      description: "Created a real-time collaborative workspace manager utilizing WebSockets, Redis, and React Redux, supporting over 10,000 active concurrent users." 
    }
  ],
  skills: [
    "JavaScript (ES6+)", "TypeScript", "React & Redux", "Node.js", "Express", "Python", 
    "PostgreSQL", "MongoDB", "Docker", "AWS (S3, EC2)", "Git & CI/CD", "RESTful APIs"
  ]
};

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth);
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const [allResumes, setAllResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'title'

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [deleteResumeId, setDeleteResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createStep, setCreateStep] = useState(1); // 1 = Title, 2 = Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resumes");
    }
  };

  const createResme = async (event) => {
    try {
      if (event) event.preventDefault();
      const { data } = await api.post('/api/resumes/create', { title, template: selectedTemplate }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAllResumes([...allResumes, data.resume]);
      setTitle('');
      setSelectedTemplate('classic');
      setCreateStep(1);
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resumeId || data.resume.id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create resume");
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!resume) {
        toast.error("Please select a PDF file first.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("title", title);

      const { data } = await api.post(
        '/api/ai/upload-resume',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setTitle('');
      setResume(null);
      setShowUploadResume(false);

      if (data && data.resumeId) {
        toast.success("Resume parsed and uploaded successfully!");
        navigate(`/app/builder/${data.resumeId}`);
      }

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put('/api/resumes/update', { resumeId: editResumeId, resumeData: { title } }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes(allResumes.map(r => r.id === editResumeId ? { ...r, title } : r));
      setTitle('');
      setEditResumeId('');
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes(allResumes.filter(r => r.id !== resumeId));
      toast.success(data.message || "Resume deleted successfully");
      setDeleteResumeId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete resume");
    }
  };

  const duplicateResume = async (resumeId) => {
    try {
      const { data } = await api.post(`/api/resumes/duplicate/${resumeId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes([...allResumes, data.resume]);
      toast.success(data.message || "Resume duplicated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to duplicate resume");
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  useEffect(() => {
    if (showCreateResume || showUploadResume || previewTemplateId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCreateResume, showUploadResume, previewTemplateId]);

  // Filter & Sort resumes list
  const filteredResumes = allResumes
    .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const publicCount = allResumes.filter(r => r.is_public).length;
  const privateCount = allResumes.length - publicCount;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Minimalist Aurora Dashboard Banner Card */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-8 mb-10 shadow-sm">
          {/* Brand red ambient glow in the top-right corner */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#e52d27]/10 to-[#b31217]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Micro-grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] opacity-100 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#e52d27]/8 to-[#b31217]/8 border border-[#e52d27]/15 rounded-full text-xs font-bold tracking-wide text-[#e52d27] mb-4">
              <Sparkles className="size-3.5 text-[#e52d27] animate-pulse" />
              AI-Powered Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Design Your Career Path, {user?.name?.split(' ')[0] || "Explorer"}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2.5 leading-relaxed font-light">
              Build polished, job-ready resumes, import existing PDF files to restructure them with AI assistance, or host public CV links online.
            </p>
          </div>
        </div>

        {/* Dashboard Statistics / Metrics widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Documents</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{allResumes.length}</h3>
            </div>
            <div className="p-3 bg-red-50 text-[#e52d27] rounded-xl">
              <FileText className="size-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Public Links</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{publicCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe className="size-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Private Drafts</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{privateCount}</h3>
            </div>
            <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
              <Lock className="size-6" />
            </div>
          </div>
        </div>

        {/* Workspace Hub Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Panel: Creator Trigger Buttons */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Create Document</h2>

            {/* Create Trigger */}
            <button
              onClick={() => setShowCreateResume(true)}
              className="w-full text-left bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-90 text-white font-bold p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group flex items-center justify-between"
            >
              <div>
                <h3 className="text-[15px]">Create Blank CV</h3>
                <p className="text-[11px] text-rose-100 font-light mt-0.5">Start fresh from scratch</p>
              </div>
              <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="size-5" />
              </div>
            </button>

            {/* Import Trigger */}
            <button
              onClick={() => setShowUploadResume(true)}
              className="w-full text-left bg-white border border-slate-200/80 hover:border-red-200 text-slate-700 hover:text-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-between"
            >
              <div>
                <h3 className="text-[15px] font-bold">Import Existing PDF</h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Upload & parse using AI</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:scale-110 transition-transform group-hover:bg-red-50">
                <UploadCloud className="size-5 text-slate-500 group-hover:text-[#e52d27]" />
              </div>
            </button>

          </div>

          {/* Right Panel: Document Directory List */}
          <div className="lg:col-span-3">

            {/* Filter and Search Bar Controller Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/50">
              <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                Document Directory
                <span className="text-xs bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  {filteredResumes.length}
                </span>
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Bar Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      type="button"
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-all"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-600 cursor-pointer"
                  >
                    <option value="recent">Recent Edit</option>
                    <option value="title">Alphabetical</option>
                  </select>
                  <SlidersHorizontal className="absolute right-3 top-2.5 size-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Resumes Grid */}
            {filteredResumes.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-sm">
                <FileText className="size-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No Documents Found</h3>
                <p className="text-sm text-slate-400 mt-1.5">No resume matches your current filter query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredResumes.map((resume, index) => {
                  const baseColor = colors[index % colors.length];
                  return (
                    <div
                      key={resume.id}
                      onClick={() => navigate(`/app/builder/${resume.id}`)}
                      className="group relative bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-300/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-72"
                    >
                      {/* Document Card Header Mini Mockup */}
                      <div className="bg-slate-50/70 border-b border-slate-100 p-4 h-44 relative flex items-center justify-center overflow-hidden">
                        {/* The Mini CV sheet */}
                        <LazyResumePreview resume={resume} />

                        {/* Top badges floating over the preview area */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">
                            {resume.template || "Classic"}
                          </span>

                          {resume.is_public ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-emerald-100/60 shadow-sm">
                              <Globe className="size-2.5" /> Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200/40 shadow-sm">
                              <Lock className="size-2.5" /> Draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content (Title) */}
                      <div className="p-4 flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 text-sm leading-snug truncate group-hover:text-[#e52d27] transition-colors">
                          {resume.title}
                        </h3>
                        <p className="text-slate-400 text-[10px] mt-1 flex items-center gap-1">
                          <Calendar className="size-3 text-slate-300" />
                          Edited {new Date(resume.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>

                      {/* Hover Overlay Action Controls */}
                      <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditResumeId(resume.id);
                            setTitle(resume.title);
                          }}
                          className="p-3 bg-white hover:bg-red-50 border border-slate-200/60 text-slate-700 hover:text-[#e52d27] shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Rename Document"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateResume(resume.id);
                          }}
                          className="p-3 bg-white hover:bg-red-50 border border-slate-200/60 text-slate-700 hover:text-[#e52d27] shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Duplicate Document"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteResumeId(resume.id);
                          }}
                          className="p-3 bg-white hover:bg-red-50 border border-slate-200/60 text-slate-700 hover:text-[#e52d27] shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Delete Document"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
        {/* Pop-up Modal for Create Resume */}
        {showCreateResume && (
          <div
            onClick={() => {
              setShowCreateResume(false);
              setTitle('');
              setCreateStep(1);
              setSelectedTemplate('classic');
            }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <div
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
                createStep === 1 ? 'max-w-md' : 'max-w-3xl'
              }`}
            >
              {createStep === 1 ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (title.trim()) setCreateStep(2);
                  }}
                >
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Create a Resume</h2>
                  <p className="text-xs text-slate-400 mb-5">Give your new resume a name to get started.</p>

                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="e.g. My Software Engineer Resume"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#e52d27] transition-all text-sm"
                    required
                  />

                  <button className="w-full py-2.5 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-90 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                    Next: Choose Template
                  </button>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">Select a Template</h2>
                  <p className="text-xs text-slate-400 mb-5">Choose a design layout for <strong>{title}</strong>.</p>

                  <div data-lenis-prevent className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-h-[380px] overflow-y-auto p-1">
                    {[
                      { id: 'classic', name: 'Classic', preview: 'border-t-4 border-slate-700 bg-white' },
                      { id: 'modern', name: 'Modern Side', preview: 'border-l-4 border-indigo-600 bg-slate-50' },
                      { id: 'minimal-image', name: 'Minimal Image', preview: 'border-t-4 border-slate-400 bg-slate-50 flex-col-reverse justify-end' },
                      { id: 'minimal', name: 'Minimal', preview: 'border border-slate-200 bg-white' },
                      { id: 'executive', name: 'Executive', preview: 'border-t-4 border-emerald-600 bg-slate-50' },
                      { id: 'creative', name: 'Creative', preview: 'border-l-4 border-rose-500 bg-rose-50/20' },
                      { id: 'modern-right', name: 'Modern Right', preview: 'border-r-4 border-indigo-600 bg-slate-50' },
                      { id: 'academic', name: 'Academic/CV', preview: 'border border-dashed border-slate-300 bg-white' },
                    ].map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`group relative p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-56 ${
                          selectedTemplate === tpl.id
                            ? 'border-[#e52d27] bg-red-50/20 shadow-md ring-2 ring-red-500/10'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow bg-white'
                        }`}
                      >
                        {/* Live Template Preview Area */}
                        <div className="w-full h-40 rounded-lg shadow-sm overflow-hidden flex items-start justify-center bg-slate-50 border border-slate-100 relative group/preview">
                          <div className="w-full h-full pointer-events-none">
                            <ResumePreview
                              data={dummyResumeData}
                              template={tpl.id}
                              accentColor="#3B82F6"
                              mode="thumbnail"
                            />
                          </div>
                        </div>

                        {/* Template Label */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 truncate mr-1">{tpl.name}</span>
                          {selectedTemplate === tpl.id && (
                            <span className="size-2 rounded-full bg-[#e52d27] flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="px-5 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 active:scale-95 transition-all text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => createResme()}
                      className="px-6 py-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-90 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-xs"
                    >
                      Create Resume
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle('');
                  setCreateStep(1);
                  setSelectedTemplate('classic');
                }}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}



        {/* Pop-up Modal for Upload Resume */}
        {showUploadResume && (
          <div
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <form
              onSubmit={uploadResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Upload & Import</h2>
              <p className="text-xs text-slate-400 mb-5">Upload an existing PDF resume. We will parse the content using AI.</p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. Imported Senior Developer CV"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#e52d27] transition-all text-sm"
                required
              />

              <div>
                <label htmlFor="resume-input" className="block text-xs font-semibold text-slate-500 mb-2">Select resume file</label>
                <label
                  htmlFor="resume-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 mb-5 hover:border-red-500 hover:bg-red-50/10 cursor-pointer transition-colors group"
                >
                  {resume ? (
                    <p className="text-sm font-bold text-[#e52d27] break-all">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-10 stroke-1 text-slate-400 group-hover:text-[#e52d27] transition-colors mb-2" />
                      <p className="text-xs text-slate-500">Choose a PDF file to upload</p>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-90 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                {isLoading && <LoaderCircle className="animate-spin size-4 text-white" />}
                {isLoading ? 'Uploading & Parsing...' : 'Import Resume'}
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle('');
                  setResume(null);
                }}
              >
                <X className="size-5" />
              </button>
            </form>
          </div>
        )}

        {/* Pop-up Modal for Rename Resume */}
        {editResumeId && (
          <div
            onClick={() => setEditResumeId('')}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <form
              onSubmit={editTitle}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Rename Resume</h2>
              <p className="text-xs text-slate-400 mb-5">Change the title of your resume document.</p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#e52d27] transition-all text-sm"
                required
              />

              <button className="w-full py-2.5 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-90 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                Rename Resume
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                onClick={() => {
                  setEditResumeId('');
                  setTitle('');
                }}
              >
                <X className="size-5" />
              </button>
            </form>
          </div>
        )}

        {/* Pop-up Modal for Delete Confirmation */}
        {deleteResumeId && (
          <div
            onClick={() => setDeleteResumeId(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-[340px] p-5 text-center overflow-hidden"
            >
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <Trash2 className="size-5 text-[#e52d27]" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Delete Resume
              </h2>
              <p className="text-xs text-slate-500 mb-5 px-2 leading-relaxed">
                Are you sure you want to delete this resume?
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteResumeId(null)}
                  className="w-1/2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold rounded-xl transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteResume(deleteResumeId)}
                  className="w-1/2 py-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-95 text-white font-semibold rounded-xl transition-all text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;