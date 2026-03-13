import { useEffect, useMemo } from 'react';
import { BarChart3, BookOpen, FlaskConical, Percent, RefreshCw } from 'lucide-react';
import { useAttendanceStore } from '../stores/useAttendanceStore';

export default function Dashboard() {
  const {
    attendanceSummary,
    summaryLoading,
    getAttendanceSummary,
  } = useAttendanceStore();

  useEffect(() => {
    getAttendanceSummary();
  }, [getAttendanceSummary]);

  const overallStats = useMemo(() => {
    const attended = attendanceSummary.reduce((acc, item) => acc + item.attended, 0);
    const total = attendanceSummary.reduce((acc, item) => acc + item.total, 0);
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    return {
      attended,
      total,
      percentage,
      lectures: attendanceSummary.filter((item) => item.subject.type === 'lecture').length,
      labs: attendanceSummary.filter((item) => item.subject.type === 'lab').length,
    };
  }, [attendanceSummary]);

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-zinc-500">Loading attendance summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      <div className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Attendance Summary</h1>
              <p className="text-zinc-400">Track your lecture and lab attendance at a glance</p>
            </div>
            <button
              type="button"
              onClick={() => getAttendanceSummary()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-light text-white mb-1">{overallStats.attended}</div>
            <div className="text-xs text-zinc-500">Classes Attended</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-light text-white mb-1">{overallStats.total}</div>
            <div className="text-xs text-zinc-500">Total Classes</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-light text-amber-400 mb-1">{overallStats.percentage}%</div>
            <div className="text-xs text-zinc-500">Overall Percentage</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-light text-amber-400 mb-1">{overallStats.lectures}</div>
            <div className="text-xs text-zinc-500">Lecture Subjects</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-light text-purple-400 mb-1">{overallStats.labs}</div>
            <div className="text-xs text-zinc-500">Lab Subjects</div>
          </div>
        </div>

        {attendanceSummary.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-white mb-2">No attendance summary found</h3>
            <p className="text-zinc-500">Start marking attendance in Today view to see data here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceSummary.map((item) => {
              const isLab = item.subject.type === 'lab';

              return (
                <div
                  key={item.subject._id}
                  className={`w-full text-left p-6 rounded-2xl border-2 ${
                    isLab
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
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

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-white">{item.subject.name}</h3>
                          <p className="text-sm text-zinc-500 font-mono mt-1">{item.subject.code}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isLab
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.subject.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="bg-black/30 border border-zinc-800 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1">Attended</p>
                          <p className="text-lg text-white">{item.attended}</p>
                        </div>
                        <div className="bg-black/30 border border-zinc-800 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1">Total</p>
                          <p className="text-lg text-white">{item.total}</p>
                        </div>
                        <div className="bg-black/30 border border-zinc-800 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            Percentage
                          </p>
                          <p className={`text-lg ${item.percentage < 75 ? 'text-red-400' : 'text-green-400'}`}>
                            {item.percentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}