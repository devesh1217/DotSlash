"use client"
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const LoadingDots = () => (
    <div className="flex space-x-2 p-3 bg-gov-dark rounded-lg max-w-[80%]">
        <div className="w-2 h-2 bg-gov-text-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gov-text-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gov-text-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
);

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (input.trim() && !isLoading) {
            const userMessage = { sender: 'user', text: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const botResponse = await fetchBotResponse(input);
                setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
            } catch (error) {
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: "Sorry, I encountered an error. Please try again."
                }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchBotResponse = async (message) => {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: message })
        });
        const data = await response.json();
        return data.reply;
    };

    return (
        <div className="fixed bottom-0 right-0 z-[1000]">
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="absolute bottom-4 right-4 w-14 h-14 bg-gov-primary text-white rounded-full shadow-gov hover:bg-gov-primary-light transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-primary"
            >
                {isOpen ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            <div 
                className={`absolute bottom-20 right-4 w-96 transition-all duration-300 transform ${
                    isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                <div className="bg-gov-dark rounded-lg shadow-gov flex flex-col h-[500px] border border-gov-border">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gov-border bg-gov-primary rounded-t-lg">
                        <h3 className="text-white font-semibold">Chat Assistant</h3>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gov-dark">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.sender === 'user' 
                                            ? 'bg-gov-primary text-white' 
                                            : 'bg-gov-secondary text-gray-100'
                                    }`}>
                                        <ReactMarkdown className="prose prose-invert max-w-none">
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <LoadingDots />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gov-border bg-gov-primary rounded-b-lg">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                disabled={isLoading}
                                className="flex-1 p-2 bg-gov-input border border-gov-border rounded-md text-gov-text focus:outline-none focus:border-gov-primary disabled:opacity-50"
                            />
                            <button 
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-2 bg-gov-accent text-gov-dark rounded-md hover:bg-gov-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
