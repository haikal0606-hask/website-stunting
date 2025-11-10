import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import n8n chat
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  useEffect(() => {
    const initializeN8nChat = () => {
      try {
        console.log('🚀 Initializing n8n chatbot...');
        
        // Pastikan container chat ada
        if (!document.getElementById('n8n-chat')) {
          const chatElement = document.createElement('div');
          chatElement.id = 'n8n-chat';
          document.body.appendChild(chatElement);
        }

        // Konfigurasi SESUAI DOKUMENTASI RESMI n8n
        createChat({
          webhookUrl: 'https://vallzl.app.n8n.cloud/webhook/6b7147b0-1233-4711-b994-9587e1981929/chat',
          target: '#n8n-chat',
          mode: 'window', // 'window' atau 'fullscreen'
          // Nonaktifkan sementara untuk hindari CORS error
          loadPreviousSession: false,
          enableStreaming: false,
          // Tambahkan metadata
          metadata: {
            app: 'Stunting Prevention Aceh',
            version: '1.0'
          },
          // Initial messages
          initialMessages: [
            'Hai 👋 Aku **SehatBot**, siap bantu kamu memahami gizi dan stunting!',
            'Mau tanya apa hari ini?'
          ],
          // i18n configuration
          i18n: {
            en: {
              title: 'SehatBot - Asisten Stunting',
              subtitle: 'Tanya tentang pencegahan stunting',
              inputPlaceholder: 'Ketik pertanyaanmu di sini...',
              getStarted: 'Mulai Percakapan Baru',
              footer: 'Stunting Prevention Aceh'
            },
          },
        });

        console.log('✅ n8n chatbot initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing n8n chatbot:', error);
        console.log('💡 Tips: Pastikan CORS di n8n workflow sudah dikonfigurasi untuk localhost:3000');
      }
    };

    // Delay sedikit untuk pastikan DOM ready
    const timer = setTimeout(initializeN8nChat, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Chat container - akan diisi oleh n8n */}
          <div id="n8n-chat"></div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;