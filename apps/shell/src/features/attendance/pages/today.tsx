import React, { useState, useEffect } from 'react';
import AttendanceModal from '../components/attendanceModal';
import {
  Calendar,
  Clock,
  BookOpen,
  FlaskConical,
  Coffee,
} from 'lucide-react';
import { useTimetableStore } from '../../timetable/stores/useTimetableStore';
import type { Day, TimetableSlot } from '@attendance/schemas';
import { useAttendanceStore } from '../stores/useAttendanceStore';

interface AttendanceData {
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'present' | 'absent' | 'bunked' | 'cancelled';
}

const Today: React.FC = () => {
  const { timetable, loading, getTimetable } = useTimetableStore();
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const { markAttendance, getAttendanceByDate, attendanceByDate } = useAttendanceStore();

  // Get current day name
  const getCurrentDay = ():
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday' => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as Day;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
  console.log("Today", today)
    return today.toISOString().split('T')[0];
  };


  useEffect(() => {
    const today = getTodayDate();
    getTimetable();
    getAttendanceByDate(today);
  }, [getTimetable, getAttendanceByDate]);

  const getAttendanceForSlot = (slot: TimetableSlot) => {
    return attendanceByDate.find(
      (a) =>
        a.subjectId._id === slot.subjectId._id &&
        a.startTime === slot.startTime &&
        a.date === getTodayDate(),
    );
  };

  // Get today's lectures
  const getTodayLectures = (): TimetableSlot[] => {
    if (!timetable) return [];
    const today = getCurrentDay();
    // console.log(today);
    return timetable[today] || [];
  };
  const todayLectures = getTodayLectures();
  const handleMarkAttendance = async (status: AttendanceData['status']) => {
    if (!selectedSlot) return;
    setMarkingAttendance(true);
    const success = await markAttendance({
      subjectId: selectedSlot.subjectId._id,
      date: getTodayDate(),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status,
    });
    if (success) {
      setSelectedSlot(null);
    }
    setMarkingAttendance(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div
            
            className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full mx-auto mb-4"
          />
          <p className="text-zinc-500">Loading today's schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Attendance Marking Modal */}
      <AttendanceModal
        isOpen={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        slot={selectedSlot}
        onMarkAttendance={handleMarkAttendance}
        loading={markingAttendance}
      />

      {/* Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Today's Classes</h1>
              <p className="text-zinc-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {todayLectures.length === 0 ? (
          // No Classes Today
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-6">
              <Coffee className="w-16 h-16 text-zinc-700 mx-auto" />
            </div>
            <h3 className="text-2xl font-light text-white mb-2">No classes today!</h3>
            <span className="text-zinc-500">Enjoy your day off </span>
          </div>
        ) : (
          // Classes List
          <div className="space-y-4">
            {todayLectures.map((slot, index) => {
              const isLab = slot.subjectId.type === 'lab';
              const attendance = getAttendanceForSlot(slot);
              const status = attendance?.status;

              return (
                <button
                  key={`${slot.subjectId._id}-${slot.startTime}`}
                
                  onClick={() => {
                    if (!status) setSelectedSlot(slot);
                  }}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all group relative hover:scale-[1.01] active:scale-[0.99] transform transition ${
                    status === 'present'
                      ? 'bg-green-500/20 border-green-500/40'
                      : status === 'absent'
                        ? 'bg-red-500/20 border-red-500/40'
                        : status === 'bunked'
                          ? 'bg-orange-500/20 border-orange-500/40'
                          : status === 'cancelled'
                            ? 'bg-zinc-600/20 border-zinc-600/40'
                            : isLab
                              ? 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500'
                              : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500'
                  }`}
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10 ${
                      isLab ? 'bg-purple-500/20' : 'bg-amber-500/20'
                    }`}
                  />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl border ${
                        isLab
                          ? 'bg-purple-500/20 border-purple-500/30'
                          : 'bg-amber-500/20 border-amber-500/30'
                      }`}
                    >
                      {isLab ? (
                        <FlaskConical className="w-6 h-6 text-purple-400" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-amber-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-white group-hover:text-amber-400 transition-colors">
                            {slot.subjectId.name}
                          </h3>
                          <p className="text-sm text-zinc-500 font-mono mt-1">
                            {slot.subjectId.code}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isLab
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {slot.subjectId.type.toUpperCase()}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <span className="text-zinc-600">•</span>
                        <span>
                          {(() => {
                            const start = slot.startTime.split(':').map(Number);
                            const end = slot.endTime.split(':').map(Number);
                            const duration = end[0] * 60 + end[1] - (start[0] * 60 + start[1]);
                            const hours = Math.floor(duration / 60);
                            const minutes = duration % 60;
                            return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
                          })()}
                        </span>
                        {status && (
                          <div className="mt-3 text-xs font-medium">
                            {status === 'present' && (
                              <span className="text-green-400">✓ Marked Present</span>
                            )}
                            {status === 'absent' && (
                              <span className="text-red-400">✕ Marked Absent</span>
                            )}
                            {status === 'bunked' && (
                              <span className="text-orange-400" role='img' aria-label='Emoji'>☕ Bunked</span>
                            )}
                            {status === 'cancelled' && (
                              <span className="text-zinc-400">Class Cancelled</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tap to mark indicator */}
                  <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500 group-hover:text-amber-400 transition-colors">
                      Tap to mark attendance
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        {todayLectures.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-light text-white mb-1">{todayLectures.length}</div>
              <div className="text-xs text-zinc-500">Total Classes</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-light text-amber-400 mb-1">
                {todayLectures.filter((s) => s.subjectId.type === 'lecture').length}
              </div>
              <div className="text-xs text-zinc-500">Lectures</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-light text-purple-400 mb-1">
                {todayLectures.filter((s) => s.subjectId.type === 'lab').length}
              </div>
              <div className="text-xs text-zinc-500">Labs</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Today;
