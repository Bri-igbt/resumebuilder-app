Resume Builder – Full‑Stack Application

<img src="https://res.cloudinary.com/dhdcmkuhx/image/upload/v1767358634/resumebuilderlogo_abs3zl.png" width="100%" height="500px" alt="image" />

A modern, full‑stack résumé builder that helps users create, edit, and manage professional résumés. The project includes a React + Vite frontend and an Express + MongoDB backend. It also integrates AI for enhancing professional summaries and job descriptions, and uses ImageKit for hosted image uploads.

Key features
- Account management: Register and log in with JWT‑based authentication
- Resume management: Create, update, delete, and fetch résumés
- AI assistance:
  - Enhance professional summary
  - Enhance job descriptions
  - Extract structured data from an uploaded résumé text and save it
- Media handling: Upload profile images to ImageKit, with optional background removal
- Modern UI stack: React 19, Redux Toolkit, React Router, Tailwind CSS

Architecture
- Frontend: React + Vite (dev server on port 5173), Axios for API calls, Redux Toolkit for state
- Backend: Node.js + Express, Mongoose for MongoDB
- AI: OpenAI API via configurable base URL and model
- File storage: ImageKit SDK

Repository layout
- client/ – React + Vite frontend
- server/ – Express + MongoDB backend

Prerequisites
- Node.js 18+ and npm
- A MongoDB database (local Atlas or self‑hosted)
- OpenAI API key (for AI features)
- ImageKit account and credentials (for profile image uploads)

Environment variables
Create and fill .env files for both server and client. Do not commit secrets.

Server (.env)
- MONGODB_URI=(required) Mongo connection string without database name suffix
  - Example: mongodb+srv://user:pass@cluster0.abcd123.mongodb.net
- JWT_SECRET=(required) Secret for signing JWT tokens
- PORT=(optional) Server port; defaults to 3000
- OPENAI_API_KEY=(required for AI) Your OpenAI API key
- OPENAI_BASE_URL=(optional) Custom base URL if you use a proxy or compatible provider
- OPENAI_MODEL=(optional) Model name; used in AI calls (e.g. gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
- IMAGEKIT_PUBLIC_KEY=(required for image upload)
- IMAGEKIT_PRIVATE_KEY=(required for image upload)
- IMAGEKIT_URL_ENDPOINT=(required for image upload)

Client (.env)
- VITE_BASE_URL=(required in production build) Base URL of the deployed server, e.g. https://api.example.com
  - In development, the client uses a Vite dev‑server proxy for /api calls, so this can be omitted locally.

Install
Run installs separately in client and server folders.

- cd server
- npm install
- cd ../client
- npm install

Development
Use two terminals. Ensure your server PORT and Vite dev proxy expectations align.

Terminal A – server
- cd server
- npm run server  # runs nodemon server.js
  - Or: npm start  # runs node server.js

Terminal B – client
- cd client
- npm run dev  # starts Vite at http://localhost:5173

Dev URLs and proxy
- Frontend dev: http://localhost:5173
- Backend: http://localhost:3000 by default (configurable via PORT)
- The Vite dev server proxies /api requests per client/vite.config.js. By default it targets:
  - https://resumebuilder-app-eight.vercel.app/ (adjust this proxy if you are running the server locally)
  - Tip: During local development, set the proxy target to http://localhost:3000 to forward /api to your local server.

Build and preview (frontend)
- cd client
- npm run build
- npm run preview  # serves the built app locally

Production deployment
- Backend: Deploy server/ to your Node hosting (Render, Railway, Fly, VPS, etc.) with server/.env variables set
- Frontend: Build the client and host the static dist/ output (Vercel, Netlify, S3/CloudFront, etc.)
  - Set VITE_BASE_URL to your deployed server origin before building so the client points to the correct API
- CORS: server/server.js allows common dev origins. Update the cors origin whitelist for your production domain(s)

API overview
Base path: /api

Auth & Users – /api/users
- POST /api/users/register
  - body: { name, email, password }
  - returns: { user, token }
- POST /api/users/login
  - body: { email, password }
  - returns: { user, token }
- GET /api/users/data (auth required – Bearer token)
  - returns: { user }
- GET /api/users/resumes (auth required)
  - returns: { resumes }

Resumes – /api/resumes (auth required unless noted)
- POST /api/resumes/create
  - body: { title }
  - returns: { resume }
- PUT /api/resumes/update
  - multipart/form-data with fields:
    - resumeId: string
    - resumeData: JSON string of the resume document to set
    - removeBackground: "yes" to attempt background removal via ImageKit (optional)
    - image: file (optional)
  - returns: { message, resume }
- DELETE /api/resumes/delete/:resumeId
  - returns: { message }
- GET /api/resumes/get/:resumeId
  - returns: { resume }
- GET /api/resumes/public/:resumeId
  - returns: { resume } (requires public: true on the document)

AI – /api/ai (auth required)
- POST /api/ai/enhance-pro-sum
  - body: { userContent: string }
  - returns: { enhancedContent }
- POST /api/ai/enhance-job-desc
  - body: { userContent: string }
  - returns: { enhancedContent }
- POST /api/ai/upload-resume
  - body: { resumeText: string, title: string }
  - Extracts structured resume data via OpenAI and saves a new document
  - returns: { message, resumeId }

Data model notes
- Resumes are stored in MongoDB. Fields include: professional_summary, skills, personal_info, experience[], projects[], education[], public, etc. See server/models/Resume.js for exact schema.
- Users are stored with hashed passwords (bcrypt) and authenticated with JWT. See server/models/User.js.

Authentication
- Include Authorization: Bearer <token> for protected endpoints. The token is returned upon register/login and validated by server/middlewares/authMiddlewares.js using JWT_SECRET.

Image uploads
- ImageKit credentials are required. The server uses configs/imageKit.js and may apply background removal via a predefined transformation (l-bg-removal) when removeBackground === "yes".

Client configuration
- Axios instance: client/src/configs/api.js
  - In dev: baseURL is empty; requests use relative /api and are proxied by Vite
  - In prod: baseURL comes from VITE_BASE_URL
- Vite proxy: client/vite.config.js
  - Update the proxy target to your API origin for local development if needed

Project scripts
Server
- npm run server – start dev server with nodemon
- npm start – start server with Node

Client
- npm run dev – start Vite dev server (port 5173)
- npm run build – build production assets
- npm run preview – preview build locally
- npm run lint – lint source code

Common issues & troubleshooting
- 401 Unauthorized: Ensure you pass a valid Bearer token. Check JWT_SECRET matches the one used to sign tokens.
- Mongo connection error: Verify MONGODB_URI is set and accessible. The code appends /resume-builder to your URI.
- CORS issues in production: Update CORS origin list in server/server.js to include your frontend origin(s).
- Image upload failures: Confirm ImageKit keys and URL endpoint are set. If background removal fails, the server falls back to a standard upload.
- AI errors or empty responses: Ensure OPENAI_API_KEY is valid, OPENAI_BASE_URL is correct if using a proxy, and OPENAI_MODEL is set to a model your account can access.

Contributing
- Fork the repo, create a feature branch, and open a PR.
- For significant changes, please open an issue to discuss what you would like to change.

License
- Add your preferred license. If none is specified, this project is provided as‑is without warranty.

Acknowledgements
- React, Vite, Tailwind CSS
- Express, Mongoose
- OpenAI
- ImageKit