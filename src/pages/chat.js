import { useState, useEffect } from 'react';
import { marked } from 'marked';

export default function Chat() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const speechRecognition = new window.webkitSpeechRecognition();
            speechRecognition.continuous = false;
            speechRecognition.interimResults = false;
            speechRecognition.lang = 'en-US';

            speechRecognition.onstart = () => setIsListening(true);
            speechRecognition.onend = () => setIsListening(false);
            speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setPrompt(transcript);
                handleSend(transcript);
            };

            setRecognition(speechRecognition);
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    }, []);

    const handleSend = async (inputPrompt = prompt) => {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: inputPrompt })
        });
        const data = await res.json();
        setResponse(data.reply);
        speakResponse(data.reply);
    };

    const handleVoiceCommand = () => {
        if (recognition) {
            recognition.start();
        }
    };

    const speakResponse = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                className="border p-2 w-full mb-4"
            />
            <div className="flex items-center mb-4">
                <button
                    onClick={() => handleSend()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
                <button
                    onClick={handleVoiceCommand}
                    className={`bg-green-500 text-white px-4 py-2 rounded ml-2 ${isListening ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isListening}
                >
                    {isListening ? (
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    ) : (
                        'Voice Command'
                    )}
                </button>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Response</h2>
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: marked(response) }}
                />
            </div>
        </div>
    );
}
