import type { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/useAuthStore';

export default function Navbar(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login', { replace: true });
  };

  const avatarLabel = user?.name?.trim().charAt(0).toUpperCase() || 'U';

  return (
    <header className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between border-b border-amber-900/30 bg-zinc-950/95 px-6 backdrop-blur-md">
      <Link
        to={user ? '/dashboard' : '/'}
        className="bg-linear-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-lg font-bold tracking-tighter text-transparent transition hover:opacity-80"
      >
        ATTENDANCE<span className="font-light">TRKR</span>
      </Link>

      {user ? (
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-amber-900/40 bg-zinc-900/80 px-3 py-1.5 text-sm text-amber-100/90 transition hover:border-amber-500/50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-semibold text-amber-300">
              {avatarLabel}
            </span>
            <span className="max-w-36 truncate">{user.name}</span>
          </summary>

          <div className="absolute right-0 mt-2 w-64 rounded-lg border border-amber-900/40 bg-zinc-950/95 p-3 text-sm shadow-xl">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Profile</p>
            <p className="mt-2 font-medium text-amber-100">{user.name}</p>
            <p className="truncate text-xs text-zinc-400">{user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-md border border-amber-900/50 px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-amber-500 transition hover:border-amber-500 hover:bg-amber-500/10"
            >
              Logout
            </button>
          </div>
        </details>
      ) : (
        <div className="flex items-center gap-3 text-sm">
          <Link
            to="/login"
            className="rounded-md border border-amber-900/40 px-3 py-1.5 text-amber-100/90 transition hover:border-amber-500/60 hover:text-amber-100"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-amber-500/90 px-3 py-1.5 font-medium text-zinc-950 transition hover:bg-amber-400"
          >
            Signup
          </Link>
        </div>
      )}
    </header>
  );
}
