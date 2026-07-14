import { Loader, Sparkle } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import api from '../config/api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import RichTextEditor from './RichTextEditor'

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {

  const {token} = useSelector(state=> state.auth)
  const [isGenerating , setIsGenerating] = useState(false)

  const generateSummary = async ()=>{
    if (isGenerating) return;
    try {
      setIsGenerating(true)
      const propmt  = `enhance my professional summary "${data}"`
      const response = await api.post('/api/ai/enchance-pro-sum' , {userContent : propmt} , {headers : {Authorization: `Bearer ${token}`} })

      setResumeData(pre=> ({...pre ,professional_summary : response.data.output}))
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }finally{
      setIsGenerating(false)
    }
  }

  return (
    <div className=' space-y-4'>
      <div className=' flex items-center justify-between'>
        <div >
          <h3 className=' flex items-center gap-2 text-lg font-semibold'> Professional Summary </h3>
          <p className=' text-sm text-gray-500'>Add summary for your resume here</p>
        </div>

        <button disabled={isGenerating} onClick={generateSummary} className=' flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-pink-200 transition-colors disabled:opacity-50'>
          {isGenerating ? (<Loader className='size-4 animate-spin'/>) : (<Sparkle className=' size-4' />)}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className=' mt-6 space-y-2'>
        <RichTextEditor 
          value={data || "" }
          onChange={onChange}
          placeholder=' Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className=' text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>

    </div>
  )
}

export default ProfessionalSummaryForm