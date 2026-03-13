import { Link, replace, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';
import type { JSX } from 'react';

export default function Navbar(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="fixed top-0 left-0 z-40 h-screen w-72 border-r border-amber-900/40 bg-zinc-950/95 p-6 backdrop-blur-md"
      aria-label="Side navigation"
    >
      <div className="mb-8">
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter bg-linear-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          ATTENDANCE<span className="font-light">TRKR</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-3">
        <Link
          to="/today"
          className="rounded-md px-3 py-2 text-sm font-medium text-amber-100/80 transition hover:bg-amber-500/10 hover:text-amber-100"
        >
          Today Attendance
        </Link>

        {user && (
          <>
            <Link
              to="/subjects"
              className="rounded-md px-3 py-2 text-sm font-medium text-amber-100/80 transition hover:bg-amber-500/10 hover:text-amber-100"
            >
              Subjects
            </Link>
            <Link
              to="/timetable"
              className="rounded-md px-3 py-2 text-sm font-medium text-amber-100/80 transition hover:bg-amber-500/10 hover:text-amber-100"
            >
              Timetable
            </Link>
            <Link
              to="/create-timetable"
              className="rounded-md px-3 py-2 text-sm font-medium text-amber-100/80 transition hover:bg-amber-500/10 hover:text-amber-100"
            >
              Create Timetable
            </Link>
            <button
              onClick={handleLogout}
              className="mt-2 rounded-md border border-amber-900/50 px-4 py-2 text-left text-xs font-bold uppercase tracking-widest text-amber-500 transition-all hover:border-amber-500 hover:bg-amber-500/10"
            >
              Sign Out
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}
