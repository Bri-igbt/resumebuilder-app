import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {dummyResumeData} from "../assets/assets.js";
import ResumePreview from "../components/ResumePreview.jsx";
import Loader from "../components/Loader.jsx";
import {ArrowLeftIcon} from "lucide-react";

const Preview = () => {
    const { resumeId } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadResumeData = async () => {
        setResumeData(dummyResumeData.find(resume => resume._id === resumeId || null));
        setIsLoading(false);
    }

    useEffect(() => {
       loadResumeData().then();
    },[])

    return resumeData ? (
        <div className='bg-slate-100'>
            <div className='max-w-3xl mx-auto  py-10'>
                <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accent_color }
                    classes='py-4 bg-white'
                />
            </div>
        </div>
    ) : (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className='flex flex-col items-center justify-center h-screen'>
                    <p className='text-center text-6xl text-slate-40 font-medium'>Resume Not Found</p>
                    <a
                        href='/'
                        className='mt-6 bg-green-500 hover:bg-green-600 text-white px-6  rounded-full h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'
                    >
                        <ArrowLeftIcon className='size-4 mr-2'/>
                        go to homepage
                    </a>
                </div>
            )}
        </div>
    )
}
export default Preview
