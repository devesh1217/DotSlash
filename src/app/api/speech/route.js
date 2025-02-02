import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import util from "util";

const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { audioData, languageCode } = req.body;
        if (!audioData) return res.status(400).json({ error: "No audio data provided" });

        // Convert base64 to buffer
        const audioBuffer = Buffer.from(audioData, "base64");

        // Google Speech-to-Text Request
        const [response] = await speechClient.recognize({
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 16000,
                languageCode: languageCode || "en-US",
            },
            audio: { content: audioBuffer.toString("base64") },
        });

        const transcript = response.results.map((r) => r.alternatives[0].transcript).join(" ");

        // Google Text-to-Speech (Bot Reply)
        const [ttsResponse] = await ttsClient.synthesizeSpeech({
            input: { text: `You said: ${transcript}` },
            voice: { languageCode: languageCode || "en-US", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" },
        });

        // Save TTS response as base64
        const audioBase64 = Buffer.from(ttsResponse.audioContent).toString("base64");

        res.status(200).json({ transcript, audioBase64 });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
