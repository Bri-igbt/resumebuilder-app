import React from 'react'
import { GraduationCap, Plus, Sparkles, Trash2} from "lucide-react";

const EducationForm = ({ data, onChange }) => {
    const addEducation = () => {
        const newEducation = {
            institution: '',
            degree: '',
            field: '',
            graduation_date: '',
            gpa: '',
        };
        onChange([...data, newEducation]);
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i)=> i !== index);
        onChange(updated);
    }
    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = {...updated[index], [field]: value}
        onChange(updated);
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        Education
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your education details
                    </p>
                </div>

                <button
                    onClick={addEducation}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg
                    hover:bg-green-200 transition-colors'
                >
                    <Plus className='size-4'/>
                    Add Education
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <GraduationCap className='w-12 h-12 mb-3 text-gray-300 mx-auto'/>
                    <p>No education added yet.</p>
                    <p className='text-sm'>Click "Add Education" to get started.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((education, index) => (
                        <div key={index} className='p-4 border space-y-3 rounded-lg border-gray-200'>
                            <div className='flex justify-between items-start'>
                                <h4>Education #{index + 1}</h4>
                                <button
                                    className='text-red-500 hover:text-red-600 transition-colors'
                                    onClick={() => removeEducation(index)}
                                >
                                    <Trash2 className='size-4'/>
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input
                                    type='text'
                                    placeholder='Institution Name'
                                    className='px-3 py-2 text-sm border border-gray-200'
                                    value={education.institution || ''}
                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                />

                                <input
                                    type='text'
                                    placeholder="Degree (e.g., Bachelor's, Master's)"
                                    className='px-3 py-2 text-sm  border border-gray-200'
                                    value={education.degree || ''}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                />

                                <input
                                    type='text'
                                    placeholder='Field of Study'
                                    className='px-3 py-2 text-sm  border border-gray-200'
                                    value={education.field || ''}
                                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                />

                                <input
                                    type='month'
                                    className='px-3 py-2 text-sm  border border-gray-200 '
                                    placeholder='Graduation Date'
                                    value={education.graduation_date || ''}
                                    onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                                />
                            </div>


                            <input
                                type='text'
                                value={education.gpa || ''}
                                placeholder='GPA (optional)'
                                onChange={(e)=> updateEducation(index, "gpa", e.target.value)}
                                className='px-3 py-2 text-sm  border border-gray-200 '
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}
export default EducationForm
