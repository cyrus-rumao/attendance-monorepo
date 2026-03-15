import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Calendar, Coffee } from 'lucide-react';
import { useTimetableStore } from '../stores/useTimetableStore';

import TimetableGrid from '../components/timetable-grid';

const Timetable: React.FC = () => {
  const navigate = useNavigate();
  const { timetable, loading, getTimetable } = useTimetableStore();

  useEffect(() => {
    getTimetable();
  }, [getTimetable]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full mx-auto mb-4" />
          <p className="text-zinc-500">Loading timetable...</p>
        </div>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-2xl font-light text-white mb-2">No timetable found</h3>
          <p className="text-zinc-500">Create your timetable to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12 pt-16">
      <div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl top-0 z-40">
        <div className="max-w-400 mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">My Timetable</h1>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 border-l-4 border-amber-500" />
                <span className="text-sm text-zinc-400">Lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20 border-l-4 border-purple-500" />
                <span className="text-sm text-zinc-400">Lab</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-zinc-600" />
                <span className="text-sm text-zinc-400">Break</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-400 mx-auto px-8 py-8">
        <TimetableGrid
          timetable={timetable}
          mode="view"
          onSlotClick={(slot) => navigate(`/subjects/${slot.subjectId._id}`)}
        />
      </div>
    </div>
  );
};

export default Timetable;
