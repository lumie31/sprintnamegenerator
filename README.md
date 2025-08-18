# Sprint Name Generator

A web application that generates creative and memorable names for agile sprints using AI.

## Features

- 🎯 **Sprint Number Input**: Enter any sprint number to generate a creative name
- 🤖 **AI-Powered**: Uses OpenAI's GPT-3.5-turbo for creative name generation
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📋 **Copy to Clipboard**: One-click copying of generated names
- 🔄 **Fallback System**: Works offline with pre-defined creative names
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Examples

- Sprint 12 → "Midnight Train"
- Sprint 16 → "Sweet Sixteen"
- Sprint 14 → "Spr1nt 4ever"
- Sprint 7 → "Lucky Seven"
- Sprint 25 → "Quarter Century"

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo API
- **HTTP Client**: Native fetch API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sprintnamegen
```

2. Install dependencies:

```bash
npm install
```

3. Set up OpenAI API key:

   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env.local` file in the root directory
   - Add: `OPENAI_API_KEY=your_openai_api_key_here`

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Input**: User enters a sprint number
2. **AI Generation**: The app sends a prompt to OpenAI's GPT-3.5-turbo model
3. **Fallback**: If AI fails, uses pre-defined creative names
4. **Display**: Shows the generated name with copy functionality

## API Endpoints

### POST `/api/generate-sprint-name`

Generates a creative sprint name based on the provided sprint number.

**Request Body:**

```json
{
  "sprintNumber": 12
}
```

**Response:**

```json
{
  "sprintName": "Midnight Train",
  "sprintNumber": 12
}
```
