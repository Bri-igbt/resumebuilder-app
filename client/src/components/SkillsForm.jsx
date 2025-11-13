import React, {useState} from 'react'
import {Plus, Sparkles, X} from "lucide-react";

const SkillsForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
       if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()]);
            setNewSkill('');
       }
    }

    const removeSkill = (index) => {
        onChange(data.filter((_, i)=> i !== index));
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg text-gray-900 font-semibold'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your technical and soft skills </p>
            </div>

            <div className='flex gap-2'>
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='Enter a skill'
                    className='flex-1 py-2 px-3 text-sm'
                />
                <button
                    onClick={addSkill}
                    className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={!newSkill.trim()}
                >
                    <Plus className='size-4'/> Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (
                        <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>
                            {skill}
                            <button onClick={() => removeSkill(index)} className='ml-1 hover:bg-blue-200 rounded-full transition-colors p-0.5'>
                                <X className='w-3 h-3'/>
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 text-gray-500'>
                    <Sparkles className='w-10 h-10 mb-3 text-gray-300 mx-auto'/>
                    <p>No skills added yet.</p>
                    <p className='text-sm'>Add your technical and soft skills above.</p>
                </div>
                )
            }

            <div className='bg-blue-50 p-3 rounded-lg'>
                <p className='text-sm text-blue-800'>
                    <strong>Tip:</strong>
                    Add 8-12 relevant skills. Include both technical skills and soft skills(leadership, communication).
                </p>
            </div>
        </div>
    )
}
export default SkillsForm
