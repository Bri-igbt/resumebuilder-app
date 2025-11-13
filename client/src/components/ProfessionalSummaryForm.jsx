import React from 'react'
import {Sparkles} from "lucide-react";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Professional Summary </h3>
                    <p className='text-sm text-gray-500'>Add summary for your resume here</p>
                </div>

                <button className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50'>
                    <Sparkles className='size-4'/>
                    AI Enhance
                </button>
            </div>

            <div className='mt-6'>
                <textarea
                    rows={7}
                    value={data || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
                    placeholder='Write a compelling summary that your key strengths and career objectives.'
                />
                <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
                    Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievement and skills.
                </p>
            </div>
        </div>
    )
}
export default ProfessionalSummaryForm
