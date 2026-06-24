import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy el asistente de Virtual Pet. ¿En qué puedo ayudarte hoy?", isBot: true }
  ]);
  // Historial en formato compatible con Gemini (role: 'user' o 'model')
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Actualizar UI inmediatamente
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await api.post('chatbot/query', {
        message: userMessage,
        user_id: user?.id,
        history: chatHistory // Enviamos el historial acumulado
      });

      const botResponse = response.data.response;
      
      // Actualizar UI con respuesta del bot
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      
      // Actualizar el historial para la PRÓXIMA vuelta
      // Gemini espera: { role: 'user'|'model', parts: [string] }
      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: [userMessage] },
        { role: 'model', parts: [botResponse] }
      ]);

    } catch (error) {
      console.error("Error en chatbot:", error);
      const errorDetail = error.response?.data?.detail || "Error de conexión";
      setMessages(prev => [...prev, { 
        text: `Lo siento, tuve un problema (${errorDetail}). ¿Podrías intentar de nuevo?`, 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip / Notificación de saludo */}
      {!isOpen && showTooltip && (
        <div className="mb-4 mr-2 bg-white px-4 py-2 rounded-2xl shadow-xl border border-brand-100 text-brand-800 text-sm font-medium animate-bounce relative cursor-pointer" onClick={() => setIsOpen(true)}>
          ¡Hola! ¿Necesitas ayuda? 🐶
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-brand-100 transform rotate-45"></div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="bg-brand-500 hover:bg-brand-600 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group relative"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-400"></span>
            </span>
          </>
        )}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-brand-500 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🐶
              </div>
              <div>
                <p className="font-bold">Asistente Virtual</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">En línea</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[400px] min-h-[350px] bg-surface-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.isBot 
                    ? 'bg-white text-gray-800 rounded-tl-none border border-brand-50' 
                    : 'bg-brand-500 text-white rounded-tr-none'
                }`}>
                  <ReactMarkdown
                    components={{
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 my-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-1" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-brand-50">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-brand-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 bg-gray-50 border-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-brand-500 text-white p-3 rounded-2xl disabled:opacity-50 hover:bg-brand-600 transition-all transform active:scale-95 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
