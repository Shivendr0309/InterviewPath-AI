# InterviewPath AI

An AI-powered interview preparation platform designed to help candidates prepare for technical interviews through personalized study plans, mock interviews, resume analysis, coding practice, and career exploration.

## Overview

InterviewPath AI brings multiple interview-preparation tools together in one platform. Users can create an account, plan their preparation, practice interview questions, review resume feedback, solve coding problems, and explore company and interview-related information.

## Key Features

### AI Study Planner
- Generate a personalized, day-wise study plan.
- Customize the plan using a topic, preparation duration, and daily study hours.
- Save generated study plans for later reference.

### AI Mock Interview
- Configure an interview based on role, company, interview type, question type, difficulty, experience level, and focus areas.
- Generate interview questions with AI.
- Submit responses and receive an evaluation.
- Review scores, strengths, weak areas, recommendations, and feedback.

### AI Resume Analyzer
- Upload a PDF resume for analysis.
- Extract resume text and analyze it with AI.
- Receive an ATS-style score, identified skills, strengths, missing keywords, and improvement suggestions.

### Coding Practice
- Browse coding problems and submit solutions.
- Track coding submissions and practice progress.

### Career and Interview Exploration
- Explore company and role-related information.
- Browse interview experiences shared through the platform.
- Access preparation resources and roadmaps.

### User and Admin Features
- User registration and login with JWT-based authentication.
- Password hashing with bcrypt.
- Profile and dashboard functionality.
- Administrative routes for managing platform content and users.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Integration | Google Gemini API using `@google/genai` |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Resume Processing | Multer, PDF.js (`pdfjs-dist`) |
| HTTP Client | Axios |

## Project Structure

```text
InterviewPath-AI/
├── client/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed or available:

- Node.js and npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Shivendr0309/InterviewPath-AI.git
cd InterviewPath-AI
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Add your own credentials. Do not commit the `.env` file or expose API keys.

Start the backend development server:

```bash
npm run dev
```

The backend runs on the configured port (8080 by default).

### 3. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal. The default development URL is usually:

```text
http://localhost:5173
```

## Available Scripts

### Frontend (`client`)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

### Backend (`server`)

| Command | Description |
|---|---|
| `npm run dev` | Start the server with Nodemon |
| `npm start` | Start the server with Node.js |
| `npm run seed` | Seed coding problems and companies |
| `npm run seed:admin` | Run the admin seed script |

## API Overview

The backend exposes versioned API routes under `/api/v1`. Main route groups include:

| Route | Purpose |
|---|---|
| `/api/v1/auth` | Authentication |
| `/api/v1/resume` | Resume analysis |
| `/api/v1/interview` | Mock interview workflow |
| `/api/v1/study-planner` | AI study plan generation |
| `/api/v1/dashboard` | Dashboard data |
| `/api/v1/companies` | Company information |
| `/api/v1/problems` | Coding problems |
| `/api/v1/submissions` | Coding submissions |
| `/api/v1/profile` | User profile |
| `/api/v1/interview-experiences` | Interview experience community |

Additional administrative routes are available under `/api/v1/admin`.

## AI Integration

The project uses Google's Gemini API for AI-assisted functionality, including study plan generation, mock interview question generation and evaluation, and resume feedback.

AI-generated output should be reviewed by users and treated as guidance rather than a guarantee of interview or recruitment outcomes.

## Security Notes

- Passwords are hashed before storage.
- JWTs are used to authenticate protected requests.
- Keep database credentials, JWT secrets, and Gemini API keys in environment variables.
- Never commit secrets or private user data to the repository.

## Future Improvements

Potential areas for future enhancement include expanded preparation analytics, additional practice resources, and further improvements to AI-generated feedback.

## Author

**Shivendra Singh**

- GitHub: [@Shivendr0309](https://github.com/Shivendr0309)

---

If you find this project useful, consider giving the repository a star.
