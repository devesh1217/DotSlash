'use client';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('./ChatBot'), {
  ssr: false
});

export default function ChatbotWrapper() {
  return <Chatbot />;
}
