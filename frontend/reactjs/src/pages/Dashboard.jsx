import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, FileTextIcon, CalendarIcon, Search, SlidersHorizontal, Eye, Lock, Globe, Sparkles, Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
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
      event.preventDefault();
      const { data } = await api.post('/api/resumes/create', { title }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAllResumes([...allResumes, data.resume]);
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resumeId}`);
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
      const confirm = window.confirm('Are you sure you want to delete this resume?');
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAllResumes(allResumes.filter(r => r.id !== resumeId));
        toast.success(data.message);
      }
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

        {/* Mesh Gradient Dashboard Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 mb-10 text-white shadow-xl">
          {/* Glass background details */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-indigo-200 mb-4 border border-white/5">
              <Sparkles className="size-3.5 text-indigo-300 animate-pulse" />
              AI-Powered Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Design Your Career Path, {user?.name?.split(' ')[0] || "Explorer"}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2.5 leading-relaxed font-light">
              Build polished, job-ready resumes, import existing PDF files to restructure them with AI assistance, or host public CV links online.
            </p>
          </div>
        </div>

        {/* Dashboard Statistics / Metrics widgets */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-100/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Documents</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{allResumes.length}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <FileTextIcon className="size-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-100/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Public Links</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{publicCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Globe className="size-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-100/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Private Drafts</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{privateCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Lock className="size-6 text-amber-600" />
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
              className="w-full text-left bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group flex items-center justify-between"
            >
              <div>
                <h3 className="text-[15px]">Create Blank CV</h3>
                <p className="text-[11px] text-indigo-100 font-light mt-0.5">Start fresh from scratch</p>
              </div>
              <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                <PlusIcon className="size-5" />
              </div>
            </button>

            {/* Import Trigger */}
            <button
              onClick={() => setShowUploadResume(true)}
              className="w-full text-left bg-white border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-between"
            >
              <div>
                <h3 className="text-[15px] font-bold">Import Existing PDF</h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Upload & parse using AI</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:scale-110 transition-transform group-hover:bg-indigo-50">
                <UploadCloudIcon className="size-5 text-slate-500 group-hover:text-indigo-600" />
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
                      <XIcon className="size-3.5" />
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
                <FileTextIcon className="size-12 text-slate-300 mx-auto mb-4" />
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
                      className="group relative bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-300/55 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-60"
                    >
                      {/* Document Card Header Mini Mockup */}
                      <div className="bg-slate-50 border-b border-slate-100 p-4 relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-sm">
                            <FileTextIcon className="size-5" style={{ color: baseColor }} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                            {resume.template || "Classic"}
                          </span>
                        </div>

                        {/* Public status badge */}
                        {resume.is_public ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <Globe className="size-3" /> Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/50">
                            <Lock className="size-3" /> Draft
                          </span>
                        )}
                      </div>

                      {/* Card Content (Title) */}
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <h3 className="font-extrabold text-slate-800 text-base leading-snug truncate group-hover:text-indigo-600 transition-colors">
                          {resume.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                          <CalendarIcon className="size-3" />
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
                          className="p-3 bg-white hover:bg-indigo-50 border border-slate-200/60 text-slate-700 hover:text-indigo-600 shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Rename Document"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateResume(resume.id);
                          }}
                          className="p-3 bg-white hover:bg-emerald-50 border border-slate-200/60 text-slate-700 hover:text-emerald-600 shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Duplicate Document"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteResume(resume.id);
                          }}
                          className="p-3 bg-white hover:bg-red-50 border border-slate-200/60 text-slate-700 hover:text-red-600 shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          title="Delete Document"
                        >
                          <TrashIcon className="size-4" />
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
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <form
              onSubmit={createResme}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">Create a Resume</h2>
              <p className="text-xs text-slate-400 mb-5">Give your new resume a name to get started.</p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. My Software Engineer Resume"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
              />

              <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                Create Resume
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle('');
                }}
              >
                <XIcon className="size-5" />
              </button>
            </form>
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                required
              />

              <div>
                <label htmlFor="resume-input" className="block text-xs font-semibold text-slate-500 mb-2">Select resume file</label>
                <label
                  htmlFor="resume-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 mb-5 hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition-colors group"
                >
                  {resume ? (
                    <p className="text-sm font-bold text-blue-600 break-all">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-10 stroke-1 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
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
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
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
                <XIcon className="size-5" />
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                required
              />

              <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
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
                <XIcon className="size-5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;