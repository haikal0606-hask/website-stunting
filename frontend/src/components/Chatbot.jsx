import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([
    { sender: 'SehatBot', text: 'Halo! Kenalkan, aku SehatBot 🤖. Sebagai asisten kesehatan pergerakan anti-stunting Banda Aceh, tanyakan apapun seputar stunting kepadaku!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;

    // Optimistic Update: Tambahkan pesan user ke UI
    setChats(prev => [...prev, { sender: 'user', text: userMessage }]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('https://n8n.vallxyz.xyz/webhook/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi server chatbot.');
      }

      const data = await res.json();

      if (data && data.reply) {
        setChats(prev => [...prev, { sender: 'SehatBot', text: data.reply }]);
      } else {
        setChats(prev => [...prev, { sender: 'SehatBot', text: 'Maaf, aku menerima respons yang tidak sesuai dari server.' }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setChats(prev => [...prev, { sender: 'SehatBot', text: 'Terjadi kesalahan jaringan, tidak dapat menghubungi SehatBot.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text, isUser) => {
    // Regex untuk mendeteksi URL http:// atau https://
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Split baris berdasarkan regex URL
      const parts = line.split(urlRegex);

      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.match(urlRegex)) {
              // Styling link sesuai bubble pengirim
              const linkClass = isUser
                ? "text-indigo-200 hover:text-white underline underline-offset-2 font-bold transition-colors"
                : "text-indigo-600 hover:text-indigo-800 underline underline-offset-2 font-bold transition-colors";

              const isGoogleMaps = part.includes('google.com/maps') || part.includes('maps.app.goo.gl');
              const linkText = isGoogleMaps ? '🗺️ Buka Google Maps' : part;

              return (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} break-all`}
                >
                  {linkText}
                </a>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Button Kanan Bawah */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-1"
            style={{ animationDuration: '3s' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Jendela Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[24rem] h-[32rem] bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden animate-fade-in-up">

          {/* Header Chat */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold leading-none">SehatBot</h3>
                <span className="text-xs text-indigo-200 font-medium">Asisten Gizi Anda</span>
              </div>
            </div>
            <button onClick={toggleChat} className="text-indigo-200 hover:text-white transition-colors p-2 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Area Chat / Pesan */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {chats.map((chat, idx) => {
              const isUser = chat.sender === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0">
                      🤖
                    </div>
                  )}
                  <div className={`px-4 py-3 max-w-[75%] shadow-sm ${isUser
                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                    }`}>
                    <div className="text-sm font-medium leading-relaxed">
                      {renderMessageContent(chat.text, isUser)}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0">🤖</div>
                <div className="bg-white border border-slate-100 text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={sendMessage} className="flex relative items-center bg-slate-50 rounded-full border border-slate-200 px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tanya soal gizi/stunting..."
                className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;
