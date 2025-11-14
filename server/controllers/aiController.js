import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

//controller for enchanting a resume professional summary
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if(!userContent) {
            return res.status(400).json({ message: 'User content is required' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. " +
                        "The summary should be only in 1-2 sentences also highlighting key skills, experience, and careers objectives." +
                        " Make it compelling and ATS friendly, and only return text no option or anything else."
                },
                {
                    role: "user",
                    content:userContent,
                },
            ],
        })
        const enhancedContent = response.choices[0].message.content.trim();
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller for enchanting a resume's job description
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (res, req) => {
    try {
        const { userContent } = req.body;

        if(!userContent) {
            return res.status(400).json({ message: 'Missing required field' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. " +
                        "The job description should be only in 1-2 sentences also highlighting key responsibility and achievement" +
                        "Use action verbs and quantifiable results where possible." +
                        " Make it compelling and ATS friendly, and only return text no option or anything else."
                },
                {
                    role: "user",
                    content:userContent,
                },
            ],
        })
        const enhancedContent = response.choices[0].message.content.trim();
        return res.status(200).json({ enhancedContent });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for uploading a resume's to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        // Validate required fields
        if (!resumeText || !title) {
            return res.status(400).json({
                message: 'Missing required fields: resumeText and title are required'
            });
        }

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const systemPrompt = 'You are an expert AI Agent to extract data from resume.';

        const userPrompt = `Extract the following data from the resume: ${resumeText}
        Provide data in the following JSON format with no additional text before or after:
        
        {
            "professional_summary": "",
            "skills": "",
            "personal_info": {
                "image": "",
                "full_name": "",
                "profession": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": ""
            },
            "experience": [
                {
                    "company": "",
                    "position": "",
                    "start_date": "",
                    "end_date": "",
                    "description": "",
                    "is_current": false
                }
            ],
            "projects": [
                {
                    "name": "",
                    "type": "",
                    "description": ""
                }
            ],
            "education": [
                {
                    "institution": "",
                    "degree": "",
                    "field": "",
                    "graduation_date": "",
                    "gpa": ""
                }
            ]
        }`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: { type: 'json_object' }
        });

        const extractData = response.choices[0].message.content.trim();
        let parsedData;
        try {
            parsedData = JSON.parse(extractData);
        } catch (parseError) {
            return res.status(500).json({
                message: 'Failed to parse AI response as JSON'
            });
        }

        // Create a résumé with the extracted data
        const newResume = await Resume.create({
            userId,
            ...parsedData,
            title
        });

        res.status(201).json({
            message: 'Resume uploaded successfully',
            resumeId: newResume._id
        });

    } catch (error) {
        console.error('Upload resume error:', error);

        // More specific error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({
            message: 'Internal server error: ' + error.message
        });
    }
};