import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {dummyResumeData} from "../assets/assets.js";
import {
    ArrowLeftIcon,
    Briefcase,
    ChevronLeft,
    ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon,
    FileText,
    FolderIcon,
    GraduationCap, Share2Icon,
    Sparkles,
    User
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm.jsx";
import ResumePreview from "../components/ResumePreview.jsx";
import TemplateSelector from "../components/TemplateSelector.jsx";
import ColorPicker from "../components/ColorPicker.jsx";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm.jsx";
import ExperienceForm from "../components/ExperienceForm.jsx";
import EducationForm from "../components/EducationForm.jsx";
import ProjectForm from "../components/ProjectForm.jsx";
import SkillsForm from "../components/SkillsForm.jsx";
import {useSelector} from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
    const { resumeId } = useParams()
    const { token } = useSelector(state => state.auth)
    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const [removeBackground, setRemoveBackground] = useState(false);

    const [resumeData, setResumeData] = useState({
        _id: '',
        title: '',
        personal_info: {},
        professional_summary: '',
        experience: [],
        education: [],
        project: [],
        skills: [],
        template: 'classic',
        accent_color: '#3B82F6',
        public: false
    });

    const loadExistingResume = async () => {
        try {
            const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(data.resume) {
                setResumeData(data.resume)
                document.title = data.resume.title;
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const sections = [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'summary', name: 'Summary', icon: FileText },
        { id: 'experience', name: 'Experience', icon: Briefcase },
        { id: 'education', name: 'Education', icon: GraduationCap },
        { id: 'projects', name: 'Project', icon: FolderIcon },
        { id: 'skills', name: 'Skills', icon: Sparkles },
    ]
    const activeSection = sections[activeSectionIndex]

    useEffect(() => {
        loadExistingResume();
    }, []);

    useEffect(() => {
        console.log('🔄 resumeData updated - Image URL:', resumeData.personal_info?.image);
    }, [resumeData.personal_info?.image]);

    const changeResumeVisibility = async () => {
       try {
           const formData = new FormData();
           formData.append('resumeId', resumeId);
           formData.append("resumeData", JSON.stringify({...resumeData, public: !resumeData.public}));

           const { data } = await api.put('/api/resumes/update', formData, {
               headers: {
                   Authorization: `Bearer ${token}`
               }
           });
           setResumeData({...resumeData, public: !resumeData.public});
           toast.success(data.message)

       } catch (error) {
           console.error('Error saving resume:',error)
       }
    }

    const handleShare = () => {
        const frontendUrl = window.location.href.split('/app/')[0]
        const resumeUrl = frontendUrl + '/view/' + resumeId;

        if(navigator.share) {
            navigator.share({url: resumeUrl, text: 'My Resume'})
                .then(r => r.success && alert('Resume shared successfully!'))

        }else {
            alert('Share not supported in this browser.')
        }
    }

    const handleDownload = () => {
        window.print();
    }

    const saveResume = async () => {
        try {

            let updatedResumeData = structuredClone(resumeData);
            const formData = new FormData();

            // Append basic data
            formData.append('resumeId', resumeId);

            // Handle image properly
            if (updatedResumeData.personal_info?.image instanceof File) {
                formData.append('image', updatedResumeData.personal_info.image);
                const resumeDataToSend = structuredClone(updatedResumeData);
                delete resumeDataToSend.personal_info.image;
                formData.append('resumeData', JSON.stringify(resumeDataToSend));

            } else {
                formData.append('resumeData', JSON.stringify(updatedResumeData));
            }

            if (removeBackground) {
                formData.append('removeBackground', 'yes');
            }

            const { data } = await api.put('/api/resumes/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('✅ Save successful:', data.message);
            console.log('🔄 Response resume data:', data.resume);

            // ✅ CRITICAL FIX: Update local state with the response from backend
            // This ensures we have the latest data including the new image URL
            if (data.resume) {
                setResumeData(data.resume);
                console.log('✅ Updated local state with backend response');
            } else {
                // Fallback: if no resume in response, update with our local data
                // but this might not have the new image URL
                setResumeData(updatedResumeData);
                console.log('⚠️ Using local data (may not have new image URL)');
            }

            toast.success(data.message);

        } catch (error) {
            console.error('❌ Error saving resume:', error);
            console.error('❌ Error response:', error.response?.data);
            toast.error(error?.response?.data?.message || 'Failed to save resume');
        }
    }

    return (
        <div>
            <div className='max-w-7xl mx-auto px-4 py-6'>
                <Link to='/app' className='inline-flex gap-2 items-center text-slate-400 hover:text-slate-700 transition-all'>
                    <ArrowLeftIcon className='size-4' />
                    Back to Dashboard
                </Link>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className='grid lg:grid-cols-12 gap-8'>
                    {/* Left Panel - Form */}
                    <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                            <hr className='absolute top-0 left-0 right-0 bg-gray-200 border-2' />
                            <hr
                                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000'
                                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }}
                            />

                            <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                                <div className='flex items-center gap-2'>
                                    <TemplateSelector
                                        selectedTemplate={resumeData.template}
                                        onChange={(template)=> setResumeData(prev => ({...prev, template}))}
                                    />

                                    <ColorPicker
                                        selectedColors={resumeData.accent_color}
                                        onChange={(color) => setResumeData(prev => ({...prev, accent_color: color}))}
                                    />
                                </div>

                                <div className='flex items-center'>
                                    {activeSectionIndex !== 0 && (
                                        <button
                                            onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                                            className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                                            disabled={activeSectionIndex === 0}
                                        >
                                            <ChevronLeft className='size-4' />
                                            Previous
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))}
                                        className=
                                            {`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all 
                                            ${activeSectionIndex === sections.length - 1 && 'opacity-50'}
                                            `}
                                        disabled={activeSectionIndex === sections.length - 1}
                                    >
                                        Next
                                        <ChevronRight className='size-4' />
                                    </button>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                {activeSection.id === 'personal' && (
                                    <PersonalInfoForm
                                        data={resumeData.personal_info}
                                        onChange={(data) => setResumeData(prev => ({...prev, personal_info: data}))}
                                        removeBackground={removeBackground}
                                        setRemoveBackground={setRemoveBackground}
                                    />
                                )}

                                {activeSection.id === 'summary' && (
                                    <ProfessionalSummaryForm
                                        data={resumeData.professional_summary}
                                        onChange={(data) => setResumeData(prev => ({...prev, professional_summary: data}))}
                                        setResumeData={setResumeData}
                                    />
                                )}

                                {activeSection.id === 'experience' && (
                                    <ExperienceForm
                                        data={resumeData.experience}
                                        onChange={(data) => setResumeData(prev =>({...prev, experience: data}))}
                                        setResumeData={setResumeData}
                                    />
                                )}

                                {activeSection.id === 'education' && (
                                    <EducationForm
                                        data={resumeData.education}
                                        onChange={(data) => setResumeData(prev =>({...prev, education: data}))}
                                        setResumeData={setResumeData}
                                    />
                                )}

                                {activeSection.id === 'projects' && (
                                    <ProjectForm
                                        data={resumeData.project}
                                        onChange={(data) => setResumeData(prev =>({...prev, project: data}))}
                                        setResumeData={setResumeData}
                                    />
                                )}

                                {activeSection.id === 'skills' && (
                                    <SkillsForm
                                        data={resumeData.skills}
                                        onChange={(data) => setResumeData(prev =>({...prev, skills: data}))}
                                        setResumeData={setResumeData}
                                    />
                                )}
                            </div>

                            <button onClick={()=> {toast.promise(saveResume, {loading: 'Saving'}).then(r => r.json())}} className='ring-green-300 text-green-600 ring hover:ring-green-400 rounded-md px-6 py-2 mt-6 text-sm bg-gradient-to-br from-green-100 to-green-200 transition-all'>
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className='lg:col-span-7 max-lg:mt-6'>
                        <div className='relative w-full'>
                            <div className='absolute left-0 right-0 bottom-3 flex justify-end items-center gap-2'>
                                {resumeData.public && (
                                    <button
                                        onClick={handleShare}
                                        className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br
                                        from-blue-100 to-blue-200 rounded-lg text-blue-600 hover:ring ring-blue-300 transition-colors'
                                    >
                                        <Share2Icon className='size-4' /> Share
                                    </button>
                                )}
                                    <button
                                        onClick={changeResumeVisibility}
                                        className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br
                                        from-purple-100 to-purple-200 rounded-lg text-purple-600 hover:ring ring-purple-300 transition-colors'
                                    >
                                        {resumeData.public ? (
                                            <EyeIcon className='size-4' />
                                        ) : (
                                            <EyeOffIcon className='size-4' />
                                        )}
                                        {resumeData.public ? 'Public' : 'Private'}
                                    </button>

                                <button
                                    onClick={handleDownload}
                                    className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100
                                    to-green-200 rounded-lg text-green-600 hover:ring ring-green-300 transition-colors'
                                >
                                    <DownloadIcon  className='size-4' />Download
                                </button>
                            </div>
                        </div>

                        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}  />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ResumeBuilder
