import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SessionLibrary from './pages/SessionLibrary';
import SessionLobby from './pages/SessionLobby';
import LiveDashboard from './pages/LiveDashboard';
import PostSessionAnalytics from './pages/PostSessionAnalytics';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sessions" element={<SessionLibrary />} />
        <Route path="/lobby/:code" element={<SessionLobby />} />
        <Route path="/dashboard" element={<LiveDashboard />} />
        <Route path="/analytics" element={<PostSessionAnalytics />} />
      </Routes>
    </Router>
  );
}
