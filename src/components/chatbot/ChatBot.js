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
    const [messages, setMessages] = useState([{
        sender: 'bot',
        text: "Hello! 👋 I'm your assistant. How can I help you today?",
        timestamp: new Date()
    }]);
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
            const userMessage = { 
                sender: 'user', 
                text: input,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const botResponse = await fetchBotResponse(input);
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: botResponse,
                    timestamp: new Date()
                }]);
            } catch (error) {
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: "Sorry, I encountered an error. Please try again.",
                    timestamp: new Date()
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
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="absolute bottom-4 right-4 w-16 h-16 bg-gov-primary text-white rounded-full shadow-lg hover:bg-gov-primary-light transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-gov-primary/50 transform hover:scale-105"
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

            <div 
                className={`absolute bottom-24 right-4 w-[400px] transition-all duration-300 transform ${
                    isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                <div className="bg-gov-dark rounded-xl shadow-2xl flex flex-col h-[600px] border border-gov-border/30 backdrop-blur-sm">
                    <div className="p-4 border-b border-gov-border/30 bg-gov-primary rounded-t-xl">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Chat Assistant
                        </h3>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gov-light scroll-smooth">
                        <div className="space-y-6">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                >
                                    <div className={`max-w-[85%] group ${
                                        msg.sender === 'user' 
                                            ? 'bg-gov-primary hover:bg-gov-primary-light' 
                                            : 'bg-gov-secondary hover:bg-gov-secondary/90'
                                    } p-4 rounded-2xl shadow-md transition-all duration-200`}>
                                        <ReactMarkdown className="prose prose-invert max-w-none text-sm">
                                            {msg.text}
                                        </ReactMarkdown>
                                        <div className={`text-xs mt-2 opacity-50 ${
                                            msg.sender === 'user' ? 'text-right' : 'text-left'
                                        }`}>
                                            {msg.timestamp?.toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-fadeIn">
                                    <LoadingDots />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gov-border/30 bg-gov-primary rounded-b-xl">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                disabled={isLoading}
                                className="flex-1 p-3 bg-gov-input/90 border border-gov-border/30 rounded-xl text-gov-text focus:outline-none focus:ring-2 focus:ring-gov-accent/50 focus:border-transparent disabled:opacity-50 placeholder-gov-text/50 transition-all duration-200"
                            />
                            <button 
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-6 py-3 bg-gov-dark text-gov-light rounded-xl hover:bg-gov-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gov-accent/50"
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
