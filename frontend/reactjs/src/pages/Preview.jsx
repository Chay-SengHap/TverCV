import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview';
import { Loader } from '../components/Loader';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../config/api';

const Preview = () => {
  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId);
      // Map to data.data to match your controller response keys safely
      if (data && data.data) {
        setResumeData(data.data);
      }
    } catch (error) {
      console.error("Error fetching public resume:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-slate-100'>
        <Loader />
      </div>
    );
  }

  return resumeData ? (
    <div className='bg-slate-100 min-h-screen'>
      <div className='max-w-3xl mx-auto py-10 px-4'>
        <ResumePreview 
          data={{
            ...resumeData,
            // Fallbacks to handle model naming differences safely in subcomponents
            personal_info: resumeData.personal_info || {},
            professional_summary: resumeData.professional_summary || "",
            experience: resumeData.experiences || [],
            education: resumeData.education || [],
            project: resumeData.projects || [],
            skills: resumeData.skills || []
          }}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen bg-slate-100'>
      <p className='text-center text-4xl lg:text-6xl text-slate-400 font-medium'>Resume not found</p>
      <a href="/" className='mt-6 bg-red-500 hover:bg-red-600 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-red-400 flex items-center transition-colors'>
        <ArrowLeftIcon className='mr-2 size-4' />
        go to home page
      </a>
    </div>
  );
};

export default Preview;