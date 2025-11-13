import React, {useState} from 'react'
import {Check, Layout} from "lucide-react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: 'classic',
            name: 'Classic',
            preview: 'A clean, traditional resume format with clear sections and professional typography.'
        },
        {
            id: 'modern',
            name: 'Modern',
            preview: 'Sleek design with strategic use of colors and modern font choice'
        },
        {
            id: 'minimal-image',
            name: 'Minimal Image',
            preview: 'Minimalist design with a focus on the content, featuring a clean and modern look.'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            preview: 'Ultra-clean design that puts your content front and center.'
        }
    ]
    return (
        <div className='relative'>
            <button className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100
            ring-blue-300 hover:ring transition-all rounded-lg py-2 px-3' onClick={() => setIsOpen(!isOpen)}>'
                <Layout size={14} />
                <span className='max-sm:hidden'>Template</span>
            </button>

            {isOpen && (
                <div className='absolute top-full  mt-2 w-xs p-3 bg-white border border-gray-200 rounded-md shadow-sm z-10'>
                    {templates.map((template) => (
                        <div
                            key={template.id} onClick={() => {onChange(template.id); setIsOpen(false)}}
                            className={`relative p-3 border rounded-md cursor-pointer transition-all 
                            ${selectedTemplate === template.id ? 'border-blue-400 bg-blue-100' : 'border-gray-300 hover:bg-gray-400 bg-gray-100'}`}
                        >
                            {selectedTemplate === template.id && (
                                <div className='absolute top-2 right-2'>
                                    <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                                        <Check className='w-3 h-3 text-white'/>
                                    </div>
                                </div>
                            )}

                            <div className='space-y-1'>
                                <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                <div className='mt-2 p-2 bg-blue-50 rounded text-sm text-gray-500 italic'>{template.preview}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default TemplateSelector
