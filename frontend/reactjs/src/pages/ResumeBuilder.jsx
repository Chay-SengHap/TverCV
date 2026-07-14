import React, { useState, useEffect } from 'react'
import { data, Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, User, FileText, Briefcase, GraduationCap, FolderIcon, Sparkles, ChevronLeft, ChevronRight, Share2Icon, EyeIcon, EyeOffIcon, DownloadIcon } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast'


const ResumeBuilder = () => {

  const { resumeId } = useParams();

  const { token } = useSelector(state => state.auth)

  const [activeTab, setActiveTab] = useState('edit') // 'edit' or 'preview'

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: "#3882F6",
    public: false
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.resume) {
        const dbResume = data.resume;

        // Map relational database arrays safely into your local state
        setResumeData({
          _id: dbResume.id,
          title: dbResume.title || "",
          personal_info: dbResume.personal_info || {},
          professional_summary: dbResume.professional_summary || "",
          experience: dbResume.experiences || [],
          education: dbResume.education || [],
          project: dbResume.projects || [],
          skills: dbResume.skills || [],
          template: dbResume.template || "classic",
          accent_color: dbResume.accent_color || "#3882F6",
          public: dbResume.is_public || false,
        });

        document.title = dbResume.title || "Resume Builder";
      }
    } catch (error) {
      console.log("Error loading resume details:", error);
      console.log(error.response);
      console.log(error.response?.data);
      console.log(error.response?.data?.message);
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ]

  const activateSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume();
  }, []);

  const [showVisibilityModal, setShowVisibilityModal] = useState(false);

  const changeResumeVisility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ is_public: !resumeData.public }))

      const { data } = await api.put(`/api/resumes/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update visibility")
      console.log(error)
    }
  }

  const handleToggleClick = () => {
    if (!resumeData.public) {
      setShowVisibilityModal(true);
    } else {
      changeResumeVisility();
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = () => {
    const previewEl = document.getElementById("resume-preview");
    if (!previewEl) {
      window.print();
      return;
    }

    const clone = previewEl.cloneNode(true);
    clone.id = "print-clone";
    document.body.appendChild(clone);
    document.body.classList.add("printing-resume-active");

    setTimeout(() => {
      window.print();
      document.body.removeChild(clone);
      document.body.classList.remove("printing-resume-active");
    }, 100);
  }

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData)

      // remove img for updated ResumeData 
      if (typeof resumeData.personal_info.image_url === 'object') {
        delete updatedResumeData.personal_info.image_url
      }

      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))

      removeBackground && formData.append('removeBackground', 'yes')
      if (resumeData.personal_info.image_url instanceof File) {
        formData.append("image", resumeData.personal_info.image_url);
      }
      const { data } = await api.put(`/api/resumes/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResumeData(prev => ({
        ...prev,
        personal_info: data.resume.personal_info || {},
        professional_summary: data.resume.professional_summary || "",
        experience: data.resume.experiences || [],
        education: data.resume.education || [],
        project: data.resume.projects || [],
        skills: data.resume.skills || [],
        template: data.resume.template || prev.template,
        accent_color: data.resume.accent_color || prev.accent_color,
        public: data.resume.is_public ?? prev.public,
      }))
      toast.success(data.message)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <>
      <div className=" max-w-7xl mx-auto px-4 py-6 flex items-center justify-between gap-4 flex-wrap">
        <Link to={'/app'} className=" inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 tranall">
          <ArrowLeftIcon className=' size-4' /> Back to Dashboard
        </Link>

        <div className='flex items-center gap-2'>
          {resumeData.public && (
            <button onClick={handleShare} className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
              <Share2Icon className=' size-4' /> Share
            </button>
          )}

          <button
            onClick={handleToggleClick}
            className={`flex items-center p-2 px-4 gap-2 text-xs rounded-lg transition-colors ${resumeData.public
                ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 hover:ring'
                : 'bg-rose-50 border border-rose-100/50 text-[#e52d27] hover:bg-rose-100/50'
              }`}
          >
            {resumeData.public ? <EyeIcon className=' size-4' /> : <EyeOffIcon className=' size-4' />}
            {resumeData.public ? 'Public' : 'Private'}
          </button>

          <button onClick={downloadResume} className=' flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
            <DownloadIcon className=' size-4' /> Download
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 mb-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'edit'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Edit Resume
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'preview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            View Preview
          </button>
        </div>
      </div>

      <div className=" max-w-7xl mx-auto px-4 pb-8">
        <div className=" grid lg:grid-cols-12 gap-8">
          {/* Left - Form Section */}
          <div className={`relative lg:col-span-5 rounded-lg overflow-hidden ${activeTab !== 'edit' ? 'max-lg:hidden' : ''}`}>
            <div className=" bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIdex */}
              <hr className=' absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className=' absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 border-none transition-all duration-2000'
                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />

              {/* Section Navigation */}
              <div className=" flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className=' flex items-center gap-2'>
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData(prev => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))}
                  />
                </div>

                {/* Next and previous button */}
                <div className=' flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                      className=' flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className=' size-4' /> Previous
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className=' size-4' />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className=" space-y-6">
                {activateSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activateSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}

                {activateSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))}
                  />
                )}

                {activateSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
                  />
                )}

                {activateSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))}
                  />
                )}

                {activateSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))}
                  />
                )}

              </div>
              <button onClick={() => { toast.promise(saveResume, { loading: 'Saving...' }) }} className=' bg-gradient-to-br from-green-100 to bg-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>

            </div>
          </div>

          {/* Right -  Preview  */}
          <div className={`lg:col-span-7 max-lg:mt-6 ${activeTab !== 'preview' ? 'max-lg:hidden' : ''}`}>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />

          </div>

        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showVisibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-5 max-w-[340px] w-full mx-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-3">
              <Share2Icon className="size-5 text-[#e52d27]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Make Resume Public?</h3>
            <p className="text-xs text-slate-500 mb-5 px-2 leading-relaxed">
              Making your resume public generates a link that anyone can access to view your details.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowVisibilityModal(false)}
                className="w-1/2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold rounded-xl transition-all text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowVisibilityModal(false);
                  changeResumeVisility();
                }}
                className="w-1/2 py-2 bg-gradient-to-r from-[#e52d27] to-[#b31217] hover:opacity-95 text-white font-semibold rounded-xl transition-all text-xs"
              >
                Yes, Make Public
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ResumeBuilder