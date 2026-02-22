import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect} from 'react';

import Navbar from './shared/components/navbar';
import LoadingSpinner from './shared/components/loading-spinner';
import Home from './pages/home';
import Login from './features/auth/pages/login';
import Signup from './features/auth/pages/signup';
import DashboardPage from './features/attendance/pages/dashboard';
import Timetable from './features/timetable/pages/timetable';
import { useAuthStore } from '../src/features/auth/stores/useAuthStore';
import Subjects from '../src/features/subjects/pages/subjects';
import SubjectDetail from '../src/features/subjects/pages/subject-detail';
import Today from '../src/features/attendance/pages/today';
import NotFound from './pages/NotFound';
import CreateTimetable from '../src/features/timetable/pages/create-timetable';
// import type { User } from './schemas/user.schema';
// import type { User } from './schemas/user.schema';

// ---- types ----

const App: React.FC = () => {
  const { user, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth && !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,#241d0b_0%,black_70%)] text-white">
      <Navbar />
      <div className="relative pt-16">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
          <Route path="/subjects" element={user ? <Subjects /> : <Navigate to="/" />} />
          <Route path="/timetable" element={user ? <Timetable /> : <Navigate to="/" />} />
          <Route
            path="/subjects/:subjectId"
            element={user ? <SubjectDetail /> : <Navigate to="/" />}
          />
          <Route path="/today" element={user ? <Today /> : <Navigate to="/" />} />
          <Route
            path="/create-timetable"
            element={user ? <CreateTimetable /> : <Navigate to="/" />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
