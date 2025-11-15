import Resume from "../models/Resume.js";
import imageKit from "../configs/imageKit.js";
import fs from "fs";

//controller for creating a new résumé
//POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        //create a new résumé
        const newResume = await Resume.create({ userId, title });
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for deleting a resume
//DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

         await Resume.findOneAndDelete({ userId, _id: resumeId })
        //return success message
        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get user resumes by ID
//GET: /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId})

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get resume by id public
//GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const {resumeId} = res.params;
        const resume = await Resume.findOne({public: true, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating a resume
//PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        try {
            resumeDataCopy = typeof resumeData === 'string' ?
                JSON.parse(resumeData) : resumeData;

        } catch (parseError) {
            return res.status(400).json({ message: 'Invalid resume data format' });
        }

        // Handle image upload
        if (image && image.buffer) {
            try {
                const response = await imageKit.upload({
                    file: image.buffer,
                    fileName: `resume-${resumeId}-${Date.now()}.${image.mimetype.split('/')[1] || 'png'}`,
                    folder: '/user-resumes',
                    useUniqueFileName: true,
                });

                resumeDataCopy.personal_info = {
                    ...resumeDataCopy.personal_info,
                    image: response.url
                };

            } catch (uploadError) {
                console.error('Image upload failed:', uploadError.message);
            }
        } else {
            console.log(' No image to upload, keeping existing personal_info');
        }

        console.log('Final data to save - personal_info:', resumeDataCopy.personal_info);

        // Update database - use $set to ensure proper merging
        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            { $set: resumeDataCopy },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: 'Saved successfully',
            resume: resume
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}