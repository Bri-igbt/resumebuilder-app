import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {dummyResumeData} from "../assets/assets.js";
import ResumePreview from "../components/ResumePreview.jsx";
import Loader from "../components/Loader.jsx";
import {ArrowLeftIcon} from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api.js";

const Preview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadResumeData = async () => {
        // Check if resumeId is available
        if (!resumeId) {
            toast.error('Resume ID is missing');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.get('/api/resumes/public/' + resumeId)
            setResumeData(data.resume)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (resumeId) {
            loadResumeData();
        } else {
            setIsLoading(false);
        }
    }, [resumeId]) // Add resumeId as dependency

    if (isLoading) {
        return <Loader />;
    }

    if (!resumeId) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <p className='text-center text-2xl text-slate-600 font-medium'>Invalid Resume Link</p>
                <a
                    href='/'
                    className='mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center transition-colors'
                >
                    <ArrowLeftIcon className='size-4 mr-2'/>
                    Go to Homepage
                </a>
            </div>
        );
    }

    return resumeData ? (
        <div className='bg-slate-100 min-h-screen'>
            <div className='max-w-3xl mx-auto py-10'>
                <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accent_color={resumeData.accent_color} // Fixed prop name
                    classes='py-4 bg-white'
                />
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
            <p className='text-center text-2xl text-slate-600 font-medium'>Resume Not Found</p>
            <p className='text-slate-500 mt-2'>This resume may be private or deleted.</p>
            <a
                href='/'
                className='mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center transition-colors'
            >
                <ArrowLeftIcon className='size-4 mr-2'/>
                Go to Homepage
            </a>
        </div>
    )
}

export default Preview;