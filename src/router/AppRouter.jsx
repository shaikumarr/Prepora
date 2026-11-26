import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QuestionProvider } from '../context/QuestionContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Results from '../pages/Results';
import MCQ from '../pages/MCQ';
import History from '../pages/History';
import Favorites from '../pages/Favorites';
import About from '../pages/About';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <QuestionProvider>
        <div className="app">
          <Navbar />
          <main className="container main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />
              <Route path="/mcq" element={<MCQ />} />
              <Route path="/history" element={<History />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </QuestionProvider>
    </BrowserRouter>
  );
}