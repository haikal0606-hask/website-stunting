import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizSession from './pages/QuizSession';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Literasi from './pages/Literasi';
import LiterasiDetail from './pages/LiterasiDetail';
import LeaderboardPage from './pages/LeaderboardPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="antialiased min-h-screen w-full bg-gray-50 text-gray-900 relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/session" element={<QuizSession />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/literasi" element={<Literasi />} />
          <Route path="/literasi/:id" element={<LiterasiDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
        
        {/* Chatbot Floating Icon & Modal diletakkan di luar Route agar muncul terus */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
