import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI); // Ensure API key is set
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
    const { prompt } = await req.json();
    const modifiedPrompt = `${prompt} answer in small bullet points only!`;

    try {
        const result = await model.generateContent(modifiedPrompt);
        const botResponse = result.response.text(); // Corrected response handling

        // Format the response as Markdown
        const markdownResponse = `## Response\n\n${botResponse}`;

        return NextResponse.json({ reply: markdownResponse });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch response from AI model' }, { status: 500 });
    }
}

export function GET() {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
