# Interview AI

AI-powered interview preparation platform that generates personalized interview reports and tailored resumes based on your profile and target job description.

## Features

- **Interview Report Generation** - AI analyzes your resume, self-description, and job description to create comprehensive interview preparation reports including:
  - Match score (0-100)
  - Technical questions with intentions and answer guidance
  - Behavioral questions with intentions and answer guidance
  - Skill gap analysis with severity levels
  - Day-wise preparation plan

- **Resume PDF Generation** - Generates ATS-friendly, professionally formatted resume PDFs tailored to specific job descriptions

- **User Authentication** - Secure JWT-based authentication with HTTP-only cookies

- **Interview History** - Save and retrieve past interview reports

## Tech Stack

### Backend
- **Runtime**: Node.js with Express 5
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API (@google/genai)
- **Validation**: Zod with zod-to-json-schema
- **PDF Generation**: Puppeteer
- **Auth**: JWT, bcryptjs, cookie-parser
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse

### Frontend
- **Framework**: React 19 with Vite 7
- **Routing**: React Router 7
- **Styling**: SCSS
- **HTTP Client**: Axios
- **Linting**: ESLint with React hooks plugin

## Project Structure

```
interview-ai-yt/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Auth, file upload middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI service (Gemini integration)
│   │   └── app.js          # Express app setup
│   ├── server.js           # Entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/       # Auth context, pages, components
│   │   │   └── interview/  # Interview context, pages, hooks, styles
│   │   ├── app.routes.jsx  # Router configuration
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Google Gemini API key

### Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start development server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Interview
- `POST /api/interview/generate-report` - Generate interview report
- `POST /api/interview/generate-resume-pdf` - Generate tailored resume PDF
- `GET /api/interview/reports` - Get user's interview reports
- `GET /api/interview/reports/:id` - Get specific report

## AI Models Used

- **Gemini 3 Flash Preview** - For generating structured interview reports and resume HTML

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT token signing |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |

## License

ISC