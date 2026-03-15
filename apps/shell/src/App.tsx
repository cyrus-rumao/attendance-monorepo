import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../src/features/auth/stores/useAuthStore';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './shared/components/loading-spinner';
import Navbar from './shared/components/navbar';
import Sidebar from './shared/components/sidebar';

const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./features/auth/pages/login'));
const Signup = lazy(() => import('./features/auth/pages/signup'));
const DashboardPage = lazy(() => import('./features/attendance/pages/dashboard'));
const Timetable = lazy(() => import('./features/timetable/pages/timetable'));
const Subjects = lazy(() => import('./features/subjects/pages/subjects'));
const SubjectDetail = lazy(() => import('./features/subjects/pages/subject-detail'));
const Today = lazy(() => import('./features/attendance/pages/today'));
const CreateTimetable = lazy(() => import('./features/timetable/pages/create-timetable'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const { user, checkAuth, checkingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      {user && <Sidebar />}
      <div
        className={`relative min-h-screen bg-[radial-gradient(circle_at_center,#241d0b_0%,black_70%)] text-white 
        ${user ? 'pl-72' : ''}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      </div>
    </>
  );
};

export default App;
