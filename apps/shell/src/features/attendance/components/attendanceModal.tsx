import { TimetableSlot } from '@attendance/schemas';
import { Ban, BookOpen, CheckCircle, Clock, Coffee, FlaskConical, XCircle } from 'lucide-react';

interface AttendanceData {
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'present' | 'absent' | 'bunked' | 'cancelled';
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimetableSlot | null;
  onMarkAttendance: (status: AttendanceData['status']) => Promise<void>;
  loading: boolean;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  slot,
  onMarkAttendance,
  loading,
}) => {
  if (!slot) return null;

  const isLab = slot.subjectId.type === 'lab';

  const attendanceOptions = [
    {
      status: 'present' as const,
      label: 'Present',
      icon: CheckCircle,
      color: 'green',
      description: 'I attended this class',
    },
    {
      status: 'absent' as const,
      label: 'Absent',
      icon: XCircle,
      color: 'red',
      description: 'I was absent',
    },
    {
      status: 'bunked' as const,
      label: 'Bunked',
      icon: Coffee,
      color: 'orange',
      description: 'I deliberately skipped',
    },
    {
      status: 'cancelled' as const,
      label: 'Cancelled',
      icon: Ban,
      color: 'zinc',
      description: 'Class was cancelled',
    },
  ];
  if (!isOpen) return null;
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {' '}
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out opacity-100 scale-100 translate-y-0">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
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
                <h2 className="text-xl font-medium text-white mb-1">Mark Attendance</h2>
                <p className="text-sm text-zinc-400">{slot.subjectId.name}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />

                  <span>
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {attendanceOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.status}
                    onClick={() => onMarkAttendance(option.status)}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50 active:scale-95 hover:scale-105 ${
                      option.color === 'green'
                        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500'
                        : option.color === 'red'
                          ? 'bg-red-500/10 border-red-500/30 hover:border-red-500'
                          : option.color === 'orange'
                            ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500'
                            : 'bg-zinc-500/10 border-zinc-500/30 hover:border-zinc-500'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        option.color === 'green'
                          ? 'text-green-400'
                          : option.color === 'red'
                            ? 'text-red-400'
                            : option.color === 'orange'
                              ? 'text-orange-400'
                              : 'text-zinc-400'
                      }`}
                    />
                    <div className="font-medium text-white text-sm mb-1">{option.label}</div>
                    <div className="text-xs text-zinc-500">{option.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceModal;
