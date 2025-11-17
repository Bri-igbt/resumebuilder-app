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

        // Validate resumeId
        if (!resumeId || resumeId.trim() === '') {
            return res.status(400).json({ message: 'Resume ID is required' });
        }

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
                const uploadOptions = {
                    file: image.buffer,
                    fileName: `resume-${resumeId}-${Date.now()}.${image.mimetype.split('/')[1] || 'png'}`,
                    folder: '/user-resumes',
                    useUniqueFileName: true,
                };

                // Add background removal transformation if requested
                if (removeBackground === 'yes') {
                    uploadOptions.transformations = [
                        {
                            pre: "l-bg-removal"
                        }
                    ];
                }

                const response = await imageKit.upload(uploadOptions);

                // Update personal_info with the new image URL
                resumeDataCopy.personal_info = {
                    ...resumeDataCopy.personal_info,
                    image: response.url
                };

            } catch (uploadError) {
                console.error('ImageKit upload failed:', uploadError.message);

                // Fallback: upload without background removal
                try {
                    const fallbackOptions = {
                        file: image.buffer,
                        fileName: `resume-${resumeId}-${Date.now()}.${image.mimetype.split('/')[1] || 'png'}`,
                        folder: '/user-resumes',
                        useUniqueFileName: true,
                    };

                    const fallbackResponse = await imageKit.upload(fallbackOptions);

                    resumeDataCopy.personal_info = {
                        ...resumeDataCopy.personal_info,
                        image: fallbackResponse.url
                    };

                } catch (fallbackError) {
                    console.error('Fallback upload failed:', fallbackError.message);
                    // If both attempts fail, don't update the image
                }
            }
        }

        // Update database
        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            { $set: resumeDataCopy },
            { new: true, runValidators: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        return res.status(200).json({
            message: 'Saved successfully',
            resume: resume
        });

    } catch (error) {
        console.error('Update resume error:', error);

        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid resume ID format' });
        }

        return res.status(500).json({ message: error.message });
    }
}