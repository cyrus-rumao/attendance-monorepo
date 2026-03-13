import type { JSX } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItemClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-amber-500/15 text-amber-200'
      : 'text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-100'
  }`;

export default function Sidebar(): JSX.Element {
  return (
    <aside
      className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-72 border-r border-amber-900/40 bg-zinc-950/95 p-6 backdrop-blur-md"
      aria-label="Side navigation"
    >
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="bg-linear-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-xl font-bold tracking-tighter text-transparent transition hover:opacity-80"
        >
          ATTENDANCE<span className="font-light">TRKR</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard" className={navItemClass}>
          Dashboard
        </NavLink>
        <NavLink to="/today" className={navItemClass}>
          Today
        </NavLink>
        <NavLink to="/subjects" className={navItemClass}>
          Subjects
        </NavLink>
        <NavLink to="/timetable" className={navItemClass}>
          Timetable
        </NavLink>
        <NavLink to="/create-timetable" className={navItemClass}>
          Create Timetable
        </NavLink>
      </nav>
    </aside>
  );
}
